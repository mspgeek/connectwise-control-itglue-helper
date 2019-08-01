import {getOrganizations, searchOrganization} from '../helpers';

const GET_ORGANIZATIONS = 'organizations/GET_ORGANIZATIONS';
const GET_ORGANIZATIONS_SUCCESS = 'organizations/GET_ORGANIZATIONS_SUCCESS';
const GET_ORGANIZATIONS_FAIL = 'organizations/GET_ORGANIZATIONS_FAIL';

const ORGANIZATION_SEARCH = 'organizations/ORGANIZATION_SEARCH';
const ORGANIZATION_SEARCH_SUCCESS = 'organizations/ORGANIZATION_SEARCH_SUCCESS';
const ORGANIZATION_SEARCH_FAIL = 'organizations/ORGANIZATION_SEARCH_FAIL';

const SELECT_ORGANIZATION = 'organizations/SELECT_ORGANIZATION';

const initialState = {
  organizations: [],
  passwords: [],
  organizationsLoading: false,
  organizationsLoaded: false,
  organizationsLoadingError: undefined,
  selectedOrganization: undefined, // stored as {value, label}

  // search values
  searchLoading: false,
  searchLoaded: false,
  searchLoadingError: undefined,
  searchResults: [],
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
    case ORGANIZATION_SEARCH:
      return {
        ...state,
        searchLoading: true,
        searchLoaded: false,
        searchLoadingError: undefined,
        searchResults: [],
      };
    case ORGANIZATION_SEARCH_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchLoaded: true,
        searchLoadingError: undefined,
        searchResults: action.result,
      };
    case ORGANIZATION_SEARCH_FAIL:
      return {
        ...state,
        searchLoading: false,
        searchLoaded: false,
        searchLoadingError: action.error,
        searchResults: [],
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

export function selectOrganization(orgId) {
  return {
    type: SELECT_ORGANIZATION,
    orgId,
  };
}

export function loadOrganizationSearch(searchText) {
  return (dispatch, getState) => {
    const {auth: {user: {server}, token}} = getState();
    return dispatch({
      types: [ORGANIZATION_SEARCH, ORGANIZATION_SEARCH_SUCCESS, ORGANIZATION_SEARCH_FAIL],
      promise: searchOrganization(server, token, searchText),
    });
  };
}
