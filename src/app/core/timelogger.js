export default {
  _values: {},

  add(key) {
    if (!this._values[key]) {
      this._values[key] = {
        time: this._now(),
        isSnapped: false
      };
    }

  },

  update(key) {
    const value = this._values[key];
    if (value) {
      value.time = this._now();
    }
  },

  reset(key) {
    const value = this._values[key];
    if (value) {
      value.isSnapped = false;
    }
  },

  snapOnce(key) {
    const value = this._values[key];
    if (value && !value.isSnapped) {
      value.isSnapped = true;
      return this._diff(key);
    }
    return 0;
  },

  snap(key) {
    return this._values[key] ? this._diff(key) : 0;
  },

  remove(key) {
    delete this._values[key];
  },

  removeAll() {
    this._values = {};
  },

  _now() {
    return performance.now();
  },

  _diff(key) {
    return Math.round(this._now() - this._values[key].time);
  },
};
