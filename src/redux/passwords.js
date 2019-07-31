import {getOrganizationPasswords} from '../helpers';

const GET_ORG_PASSWORDS = 'passwords/GET_ORG_PASSWORDS';
const GET_ORG_PASSWORDS_SUCCESS = 'passwords/GET_ORG_PASSWORDS_SUCCESS';
const GET_ORG_PASSWORDS_FAIL = 'passwords/GET_ORG_PASSWORDS_FAIL';

const initialState = {
  passwords: [],
  passwordsLoading: false,
  passwordsLoaded: false,
  passwordsLoadError: undefined,
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
