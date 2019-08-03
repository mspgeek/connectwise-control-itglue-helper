const ALERT_SHOW = 'alert/ALERT_SHOW';
const ALERT_HIDE = 'alert/ALERT_HIDE';

const RESET = 'alert/RESET';


const initialState = {
  show: false,
  message: '',
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ALERT_SHOW:
      return {
        ...state,
        message: action.message,
        show: true,
      };
    case ALERT_HIDE:
      return {
        ...state,
        message: '',
        show: false,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }

}

export function showAlert(message) {
  return {
    type: ALERT_SHOW,
    message,
  };
}

export function dismissAlert() {
  return {
    type: ALERT_HIDE,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
