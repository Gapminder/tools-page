import { URLI } from "./url";

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

function getCurrentTransition() {
  return toolsPage_toolset.filter(f => f.id === URLI["chart-type"])[0].transition;
}

function getTransitionModel(newTransition) {
  const result = { state: {} };
  const currentTransition = getCurrentTransition();
  if (!currentTransition || !newTransition ||
    currentTransition.includes(transition.NONE) || 
    newTransition.includes(transition.NONE)) return {};

  const dim = "geo";

  newTransition.forEach(transitionTo => {
    const transitionFrom = currentTransition.filter(transition => transitions[transitionTo].allow.includes(transition))[0];
    const values = transitions[transitionFrom].from(URLI.model.state || {}, dim);
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
