
// usage: holdButton(d3.selectAll('.hold-btn'), (el, evt, d) => { /* delete */ }, 2000)
export function holdButton(selection, onHoldComplete, duration = 1000) {
    const state = new WeakMap();
  
    selection.each(function () {
      const el = this;
      const btn = d3.select(el);
      state.set(el, { timer: null, done: false });
  
      const start = (event) => {
        const s = state.get(el);
        if (!s || s.done) return;
        btn.classed('is-holding', true);
        // avoid text selection while holding
        event.preventDefault?.();
  
        s.timer = setTimeout(() => {
          s.done = true;
          btn.classed('is-holding', false).classed('is-done', true);
          onHoldComplete && onHoldComplete(el, event, btn.datum());
        }, duration);
      };
  
      const cancel = () => {
        const s = state.get(el);
        if (!s) return;
        clearTimeout(s.timer);
        if (!s.done) btn.classed('is-holding', false);
      };
  
      btn
        .on('pointerdown.hold', start)
        .on('pointerup.hold pointerleave.hold pointercancel.hold', cancel)
        .on('contextmenu.hold', (e) => e.preventDefault()); // stop long-press menu
    });
  
    // optional tiny API
    selection.resetHold = () =>
      selection.each(function () {
        const s = state.get(this);
        if (s) s.done = false;
        d3.select(this).classed('is-done', false).classed('is-holding', false);
      });
  
    return selection;
  }