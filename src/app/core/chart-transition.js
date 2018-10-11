const transition = {
  SELECT: "select",
  SHOW: "show",
  TIME: "time",
  NONE: "none"
}

const transitions = {
  select: {
    allow: [transition.SELECT, transition.SHOW],
    from: (state, dim) => {
      const markerSelect = (state.marker || {}).select;
      return markerSelect ? markerSelect.map(selection => selection[dim]) : null;
    },
    to: (values, dim) => {
      return {
        marker: {
          select: values.map(value => ({ [dim]: value }))
        }
      }
    }
  },

  show: {
    allow: [transition.SELECT, transition.SHOW],
    from: (state, dim) => {
      const values = (((state.entities || {}).show || {})[dim] || {}).$in;
      return values ? values.slice(0) : null;
    },
    to: (values, dim) => {
      if (values.length == 0) return {};
      return {
        entities: {
          show: {
            [dim]: {
              $in: values
            }
          }
        }
      }
    }
  },

  time: {
    allow: [transition.TIME],
    from: state => (state.time || {}).value,
    to: value => ({ time: { value } } )
  }
}

function getTransitionModel(oldModel, oldTransition, newTransition) {
  const result = { state: {} };
  if (!oldTransition || !newTransition ||
    oldTransition.includes(transition.NONE) || 
    newTransition.includes(transition.NONE)) return {};

  const dim = "geo";

  newTransition.forEach(transitionTo => {
    const transitionFrom = oldTransition.filter(transition => transitions[transitionTo].allow.includes(transition))[0];
    const values = transitions[transitionFrom].from(oldModel.state || {}, dim);
    if (!values) return;
    Object.assign(result.state, transitions[transitionTo].to(values, dim));
  });
  
  if (!Object.keys(result.state).length) {
    delete result.state;
  }  
  return result;
}

export {
  getTransitionModel
};
