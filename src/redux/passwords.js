import {getPasswordById} from '../helpers';

const GET_PASSWORD = 'passwords/GET_PASSWORD';
const GET_PASSWORD_SUCCESS = 'passwords/GET_PASSWORD_SUCCESS';
const GET_PASSWORD_FAIL = 'passwords/GET_PASSWORD_FAIL';

const SELECT_PASSWORD = 'passwords/SELECT_PASSWORD';

const RESET = 'passwords/RESET';

const initialState = {
  passwords: [],
  passwordsLoading: false,
  passwordsLoaded: false,
  passwordsLoadError: undefined,

  password: undefined,
  passwordLoaded: false,
  passwordLoading: false,
  passwordLoadError: undefined,

  passwordId: undefined,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_PASSWORD: {
      return {
        // reset to initial state
        ...initialState,
        passwordId: action.passwordId,
      };
    }
    case GET_PASSWORD:
      return {
        ...state,
        password: undefined,
        passwordLoaded: false,
        passwordLoading: true,
        passwordLoadError: undefined,
      };
    case GET_PASSWORD_SUCCESS:
      return {
        ...state,
        password: action.result,
        passwordLoaded: true,
        passwordLoading: false,
        passwordLoadError: undefined,
      };
    case GET_PASSWORD_FAIL:
      return {
        ...state,
        password: undefined,
        passwordLoaded: false,
        passwordLoading: false,
        passwordLoadError: action.error,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export function loadPasswordById(passwordId) {
  return (dispatch, getState) => {
    const {auth: {token}} = getState();
    dispatch({
      types: [GET_PASSWORD, GET_PASSWORD_SUCCESS, GET_PASSWORD_FAIL],
      promise: getPasswordById({token, passwordId, showPassword: false}),
    });
  };
}

export function selectPasswordId(passwordId) {
  return {
    type: SELECT_PASSWORD,
    passwordId,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
