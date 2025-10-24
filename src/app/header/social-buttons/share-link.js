import { supabaseClient } from "../../auth/supabase.service";

export async function createShareLinkModal(opts = {}) {
  const {
    baseUrl = '',
    slug = '',
    lifetimeOptions = ['1 week', '1 month', '6 months', '1 year'],
    checkSlugAvailability = async (t) => {
      await new Promise(r => setTimeout(r, 250));
      return !/taken|used/.test(t);
    },
    getPrivateDsOwned = async () => [],
    onSave = () => {}
  } = opts;

  const overlay = d3.select('body')
    .append('div')
    .attr('class', 'sl-overlay');

  const dialog = overlay
    .append('div')
    .attr('class', 'sl-dialog')

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
  lifetimeRow.append('label').attr('class', 'sl-label').text('How long to keep it working?');
  const select = lifetimeRow.append('select').attr('class', 'sl-select');
  lifetimeOptions.forEach(opt => {
    select.append('option').attr('value', opt).text(opt);
  });

  const privateDsOwned = await getPrivateDsOwned();
  if (privateDsOwned.length) {
    const privateDsWrapper = dialog.append("div").attr("class", 'sl-private-ds');
    privateDsWrapper.append("div").text("Also share the private datasets via the link:");
    privateDsWrapper.selectAll("input").data(privateDsOwned)
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
    const dsArray = [];
    dialog.select(".sl-private-ds").selectAll("input")
      .each(function() {
        if (this.checked) {
          dsArray.push(d3.select(this).attr("id"));
        }
      })
    return dsArray;
  }

  const actions = dialog.append('div').attr('class', 'sl-actions');
  const btnCancel = actions.append('button').attr('class', 'sl-btn sl-cancel').attr('type', 'button').text('Cancel');
  const btnSave = actions.append('button').attr('class', 'sl-btn sl-save').attr('type', 'button').text('Save and close');

  let checkId = 0;
  function setAvailabilityText(text, state) {
    availability.attr('class', 'sl-availability' + (state ? ' ' + state : '')).text(text || '');
  }

  async function checkSlug(t) {
    const id = ++checkId;
    setAvailabilityText('Checking...');
    btnSave.attr('disabled', true);
    try {
      const ok = await checkSlugAvailability(t);
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

  btnCancel.on('click', () => closeModal());

  btnSave.on('click', async () => {
    const tok = slugInput.node().value.trim();
    const life = select.node().value;
    const ok = await checkSlugAvailability(tok);
    if (!ok) {
      setAvailabilityText('Name taken', 'busy');
      slugInput.node().focus();
      return;
    }
    const url = baseUrl + tok;
    closeModal();
    onSave({ url, slug: tok, lifetime: life, privateDs: getPrivateDsInputChecked() });
  });

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
