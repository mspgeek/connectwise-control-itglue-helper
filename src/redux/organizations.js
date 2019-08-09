import filter from 'lodash/filter';
import {getOrganizationPasswords} from '../helpers';

const GET_ORG_PASSWORDS = 'organizations/GET_ORG_PASSWORDS';
const GET_ORG_PASSWORDS_SUCCESS = 'organizations/GET_ORG_PASSWORDS_SUCCESS';
const GET_ORG_PASSWORDS_FAIL = 'organizations/GET_ORG_PASSWORDS_FAIL';

const SET_PASSWORD_SEARCH_TEXT = 'organizations/SET_PASSWORD_SEARCH_TEXT';
const FILTER_PASSWORDS = 'organization/FILTER_PASSWORDS';
const SELECT_ORGANIZATION = 'organizations/SELECT_ORGANIZATION';
const RESET = 'organizations/RESET';

export const initialState = {
  selectedOrganization: undefined,
  passwordSearchText: '',

  // passwords
  passwordsLoading: false,
  passwordsLoaded: false,
  passwordsLoadError: undefined,
  organizationPasswords: [],
  filteredPasswords: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_ORG_PASSWORDS:
      return {
        ...state,
        passwordsLoading: true,
        passwordsLoaded: false,
        passwordsLoadError: undefined,
        organizationPasswords: [],
      };
    case GET_ORG_PASSWORDS_SUCCESS:
      return {
        ...state,
        passwordsLoading: false,
        passwordsLoaded: true,
        passwordsLoadError: undefined,
        organizationPasswords: action.result,
      };
    case GET_ORG_PASSWORDS_FAIL:
      return {
        ...state,
        passwordsLoading: false,
        passwordsLoaded: false,
        passwordsLoadError: undefined,
        organizationPasswords: [],
      };
    case SET_PASSWORD_SEARCH_TEXT:
      return {
        ...state,
        passwordSearchText: action.passwordSearchText,
      };
    case SELECT_ORGANIZATION:
      return {
        ...initialState,
        selectedOrganization: action.organization,
      };
    case FILTER_PASSWORDS:
      return {
        ...state,
        filteredPasswords: action.filteredPasswords,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export function selectOrganization(organization) {
  return {
    type: SELECT_ORGANIZATION,
    organization,
  };
}

export function loadOrganizationPasswords() {
  return (dispatch, getState) => {
    const state = getState();
    const {auth: {token}, organizations: {selectedOrganization: {id}}} = state;

    return dispatch({
      types: [GET_ORG_PASSWORDS, GET_ORG_PASSWORDS_SUCCESS, GET_ORG_PASSWORDS_FAIL],
      promise: getOrganizationPasswords({token, id}),
    });
  };
}

export function setPasswordSearchText(passwordSearchText) {
  return {
    type: SET_PASSWORD_SEARCH_TEXT,
    passwordSearchText,
  };
}

export function filterPasswords(passwordSearchText) {
  return (dispatch, getState) => {
    const {organizations: {organizationPasswords}} = getState();
    if (!passwordSearchText) {
      return dispatch({
        type: FILTER_PASSWORDS,
        filteredPasswords: organizationPasswords.concat(),
      });
    }

    const filteredPasswords = filter(organizationPasswords, elem => {
      return elem.name.toLocaleLowerCase().indexOf(passwordSearchText) > -1;
    });

    dispatch({
      type: FILTER_PASSWORDS,
      filteredPasswords,
    });
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
