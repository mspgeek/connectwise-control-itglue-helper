import {getOrganizationPasswords, getAndSendPassword} from '../helpers';

const GET_ORG_PASSWORDS = 'passwords/GET_ORG_PASSWORDS';
const GET_ORG_PASSWORDS_SUCCESS = 'passwords/GET_ORG_PASSWORDS_SUCCESS';
const GET_ORG_PASSWORDS_FAIL = 'passwords/GET_ORG_PASSWORDS_FAIL';

const GET_PASSWORD = 'passwords/GET_PASSWORD';
const GET_PASSWORD_SUCCESS = 'passwords/GET_PASSWORD_SUCCESS';
const GET_PASSWORD_FAIL = 'passwords/GET_PASSWORD_FAIL';

const initialState = {
  passwords: [],
  passwordsLoading: false,
  passwordsLoaded: false,
  passwordsLoadError: undefined,

  password: undefined,
  passwordLoaded: false,
  passwordLoading: false,
  passwordLoadError: undefined,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_ORG_PASSWORDS:
      return {
        ...state,
        passwordsLoading: true,
        passwordsLoaded: false,
        passwordsLoadError: undefined,
        passwords: [],
      };
    case GET_ORG_PASSWORDS_SUCCESS:
      return {
        ...state,
        passwordsLoading: false,
        passwordsLoaded: true,
        passwordsLoadError: undefined,
        passwords: action.result,
      };
    case GET_ORG_PASSWORDS_FAIL:
      return {
        ...state,
        passwordsLoading: false,
        passwordsLoaded: false,
        passwordsLoadError: undefined,
        passwords: [],
      };
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
    default:
      return state;
  }
}

export function loadOrganizationPasswords() {
  return (dispatch, getState) => {
    const state = getState();
    const {auth: {token}, organizations: {selectedOrganization}} = state;

    return dispatch({
      types: [GET_ORG_PASSWORDS, GET_ORG_PASSWORDS_SUCCESS, GET_ORG_PASSWORDS_FAIL],
      promise: getOrganizationPasswords(token, selectedOrganization.value),
    });
  };
}

export function loadPassword(orgId, passwordId) {
  return (dispatch, getState) => {
    const {auth: {token}} = getState();
    dispatch({
      types: [GET_PASSWORD, GET_PASSWORD_SUCCESS, GET_PASSWORD_FAIL],
      promise: getAndSendPassword(token, orgId, passwordId),
    });
  };
}
