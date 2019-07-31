import {getOrganizations} from '../helpers';

const GET_ORGANIZATIONS = 'organizations/GET_ORGANIZATIONS';
const GET_ORGANIZATIONS_SUCCESS = 'organizations/GET_ORGANIZATIONS_SUCCESS';
const GET_ORGANIZATIONS_FAIL = 'organizations/GET_ORGANIZATIONS_FAIL';

const GET_ORG_PASSWORDS = 'organizations/GET_ORG_PASSWORDS';
const GET_ORG_PASSWORDS_SUCCESS = 'organizations/GET_ORG_PASSWORDS_SUCCESS';
const GET_ORG_PASSWORDS_FAIL = 'organizations/GET_ORG_PASSWORDS_FAIL';

const SELECT_ORGANIZATION = 'organizations/SELECT_ORGANIZATION';

const initialState = {
  organizations: [],
  passwords: [],
  organizationsLoading: false,
  organizationsLoaded: false,
  organizationsLoadingError: undefined,
  selectedOrganization: undefined, // stored as {value, label}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_ORGANIZATIONS:
      return {
        ...state,
        organizations: [],
        organizationsLoading: true,
        organizationsLoaded: false,
        organizationsLoadingError: undefined,
      };
    case GET_ORGANIZATIONS_SUCCESS:
      return {
        ...state,
        organizations: action.result,
        organizationsLoading: false,
        organizationsLoaded: true,
        organizationsLoadingError: undefined,
      };
    case GET_ORGANIZATIONS_FAIL:
      return {
        ...state,
        organizations: [],
        organizationsLoading: false,
        organizationsLoaded: false,
        organizationsLoadingError: action.error,
      };
    case SELECT_ORGANIZATION:
      return {
        ...state,
        selectedOrganization: action.orgId,
      };
    default:
      return state;
  }
}

export function loadOrganizations() {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    return dispatch({
      types: [GET_ORGANIZATIONS, GET_ORGANIZATIONS_SUCCESS, GET_ORGANIZATIONS_FAIL],
      promise: getOrganizations(token),
    });
  };
}

export function loadOrganizationPasswords(token, orgId) {

}

export function selectOrganization(orgId) {
  return {
    type: SELECT_ORGANIZATION,
    orgId,
  };
}
