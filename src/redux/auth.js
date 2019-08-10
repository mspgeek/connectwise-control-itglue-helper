import {saveToken, verifyToken, getItGlueJsonWebToken, clearStore, getSavedToken} from '../helpers';
import {reset as resetAlert, dismissAlert} from './alert';
import {reset as resetPasswords} from './passwords';
import {reset as resetSearch, setActiveComponent} from './search';

const LOGOUT = 'auth/LOGOUT';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';

const SET_AUTH = 'auth/SET_AUTH';
const NO_TOKEN = 'auth/NO_TOKEN';

const LOGIN_TOKEN = 'auth/LOGIN_TOKEN';
const LOGIN_TOKEN_SUCCESS = 'auth/LOGIN_TOKEN_SUCCESS';
const LOGIN_TOKEN_FAIL = 'auth/LOGIN_TOKEN_FAIL';

const RESET = 'auth/RESET';

export const initialState = {
  user: {
    subdomain: '',
    otp: '',
    email: '',
    password: '',
  },
  loginPending: false,
  loginError: undefined,
  loggedIn: false,

  token: getSavedToken(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loginPending: true,
        loginError: undefined,
        loggedIn: false,
        token: undefined,
      };
    case LOGIN_SUCCESS:
      saveToken(action.result);
      return {
        ...state,
        loginPending: false,
        loginError: undefined,
        loggedIn: true,
        token: action.result,
      };
    case LOGIN_FAIL:
      saveToken('');
      return {
        ...state,
        loginPending: false,
        loginError: action.error,
        loggedIn: false,
        token: undefined,
      };
    case SET_AUTH:
      return {
        ...state,
        user: {
          ...state.user,
          [action.name]: action.value,
        },
      };
    case NO_TOKEN:
      saveToken('');
      return {
        ...state,
        token: undefined,
      };
    case LOGIN_TOKEN:
      return {
        ...state,
        loginPending: true,
        loginError: undefined,
        loggedIn: false,
      };
    case LOGIN_TOKEN_SUCCESS:
      return {
        ...state,
        loginPending: false,
        loginError: undefined,
        loggedIn: true,
      };
    case LOGIN_TOKEN_FAIL:
      saveToken('');
      return {
        ...state,
        loginPending: false,
        loginError: action.error,
        loggedIn: false,
        token: undefined,
      };
    case LOGOUT:
      return {
        ...initialState,
        token: undefined,
      };
    case RESET:
      return {
        ...initialState,
        token: undefined,
      };
    default:
      return state;
  }
}

export function login() {
  return (dispatch, getState) => {
    const {subdomain, otp, email, password} = getState().auth.user;

    return dispatch({
      types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
      promise: getItGlueJsonWebToken({subdomain, otp, email, password})
        .then((token) => {
          dispatch(dismissAlert());
          dispatch(setActiveComponent('header'));
          saveToken(token);
          return token;
        }),
    });
  };
}

export function checkToken() {
  return (dispatch, getState) => {
    const {token} = getState().auth;
    if (!token) {
      return dispatch({type: NO_TOKEN});
    }

    return dispatch({
      types: [LOGIN_TOKEN, LOGIN_TOKEN_SUCCESS, LOGIN_TOKEN_FAIL],
      promise: verifyToken(token)
        .then(() => {
          dispatch(dismissAlert());
        }),
    });
  };
}

export function setAuth(name, value) {
  return {
    type: SET_AUTH,
    name,
    value,
  };
}

export function logout() {
  clearStore();
  saveToken('');
  return (dispatch) => {
    dispatch({type: LOGOUT});
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function resetAll() {
  saveToken('');
  return (dispatch) => {
    dispatch(resetAlert());
    dispatch(resetPasswords());
    dispatch(resetSearch());
    dispatch(reset());
  };
}
