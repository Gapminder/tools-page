
export async function createShareLinkModal(opts = {}) {
  const {
    pageId = null,
    isLoggedIn = false,
    baseUrl = '',
    slug = '',
    checkSlugAvailability = async (t) => {
      await new Promise(r => setTimeout(r, 250));
      return !/taken|used/.test(t);
    },
    getPrivateDsOwned = async () => [],
    onSave = () => {}
  } = opts;

  const lifetimeOptions = isLoggedIn
    ? ['Not important', '1 week', '1 month', '6 months', '1 year', '5 years (i.e. for a digital course)', 'Forever (i.e. for a paper book)']
    : ['Not important', '1 week', '1 month'];

  const overlay = d3.select('body')
    .append('div')
    .attr('class', 'sl-overlay');

  const dialog = overlay
    .append('div')
    .attr('class', 'sl-dialog')

  dialog.append('a').attr('class', 'sl-close').text('✕').on('click', closeModal);
  dialog.append('div').attr('class', 'sl-title').text('Share a link');

  const urlRow = dialog.append('div').attr('class', 'sl-column');
  const urlInner = urlRow.append('div').attr('class', 'sl-row');

  urlInner.append('div')
    .attr('class', 'sl-base')
    .text(baseUrl);

  const slugWrapper = urlInner.append('div').attr('class', 'sl-slug-wrapper');
  const slugInput = slugWrapper.append('input')
    .attr('class', 'sl-slug')
    .attr('type', 'text')
    .property('value', slug);

  const availability = slugWrapper.append('div')
    .attr('class', 'sl-availability');

  const lifetimeRow = dialog.append('div').attr('class', 'sl-row sl-lifetime-row');
  const labelWrapper = lifetimeRow.append('div').attr('class', 'sl-label-wrapper');
  labelWrapper.append('label').attr('class', 'sl-label').text('Requested maintenance');
  const tooltip = labelWrapper.append('span').attr('class', 'sl-tooltip-trigger').text('?');
  tooltip.append('span').attr('class', 'sl-tooltip-text').html(
    '🦺 Let maintainers know how long you need this link for! <br/><br/> We can\'t guarantee all links working forever, but if we have your humble request, we can prioritise. <br/><br/> Longer time intervals available to registered users.'
  );
  const select = lifetimeRow.append('select').attr('class', 'sl-select');
  lifetimeOptions.forEach(opt => {
    select.append('option').attr('value', opt).text(opt);
  });
  if (!isLoggedIn) {
    select.append('option').attr('disabled', true).text('Log in to have longer options');
  }

  const privateDsOwned = isLoggedIn ? await getPrivateDsOwned() : [];
  if (privateDsOwned.length) {
    const privateDsWrapper = dialog.append("div").attr("class", 'sl-private-ds');
    privateDsWrapper.append("div").text("Also share the private datasets via the link:");
    privateDsWrapper.selectAll("input").data(privateDsOwned.map(ds => ds.slug))
      .join(enter => {
        const wrapper = enter.append("span");
        wrapper.append("input")
          .attr("type", "checkbox")
          .attr("id", d => d);
        wrapper.append("label")
          .attr("for", d => d)
          .text(d => d);
      })
  }

  function getPrivateDsInputChecked() {
    const checkedSlugs = new Set();
    dialog.select(".sl-private-ds").selectAll("input")
      .each(function() {
        if (this.checked) {
          checkedSlugs.add(d3.select(this).attr("id"));
        }
      })
    return privateDsOwned.filter(ds => checkedSlugs.has(ds.slug));
  }

  const actions = dialog.append('div').attr('class', 'sl-actions');
  actions.append('button').attr('class', 'sl-btn sl-cancel').attr('type', 'button').text('Cancel').on('click', closeModal);
  const btnSave = actions.append('button').attr('class', 'sl-btn sl-save').attr('type', 'button').text('Create link and copy to 📑');

  let checkId = 0;
  function setAvailabilityText(text, state) {
    availability.attr('class', 'sl-availability' + (state ? ' ' + state : '')).text(text || '');
  }

  async function checkSlug(t) {
    const id = ++checkId;
    setAvailabilityText('Checking...');
    btnSave.attr('disabled', true);
    try {
      const ok = await checkSlugAvailability(t, pageId);
      if (id !== checkId) return;
      setAvailabilityText(ok ? 'Name available' : 'Name taken', ok ? 'ok' : 'busy');
      btnSave.attr('disabled', ok ? null : true);
    } catch (e) {
      if (id !== checkId) return;
      setAvailabilityText('Error checking', 'busy');
      btnSave.attr('disabled', true);
    }
  }

  if ((slug || '').toString().trim()) checkSlug(slug.toString().trim());

  // debounce input
  let debounceTimer = null;
  slugInput.on('input', function () {
    const val = this.value.trim();
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (val) checkSlug(val);
      else {
        setAvailabilityText('');
        btnSave.attr('disabled', null);
      }
    }, 350);
  });

  function closeModal() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
  }

  btnSave.on('click', async () => {
    const tok = slugInput.node().value.trim();
    const life = select.node().value;
    const ok = await checkSlugAvailability(tok, pageId);
    if (!ok) {
      setAvailabilityText('Name taken', 'busy');
      slugInput.node().focus();
      return;
    }
    const url = baseUrl + tok;
    closeModal();
    onSave({ url, slug: tok, lifetime: life, privateDs: getPrivateDsInputChecked(), copyToClipboard });
  });

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const nodes = dialog.node().querySelectorAll('input,select,button,[tabindex]:not([tabindex="-1"])');
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  }
  document.addEventListener('keydown', onKeyDown);

  setTimeout(() => {
    slugInput.node().focus();
  }, 0);

  return {
    close: closeModal,
    setSlug: (t) => {
      slugInput.property('value', t);
      if ((t || '').toString().trim()) checkSlug(t.toString().trim());
    },
    setLifetime: (l) => {
      select.property('value', l);
    }
  };
}
