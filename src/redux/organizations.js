import {loadOrganizationPasswords} from './passwords';

const GET_ORGANIZATIONS = 'organizations/GET_ORGANIZATIONS';
const GET_ORGANIZATIONS_SUCCESS = 'organizations/GET_ORGANIZATIONS_SUCCESS';
const GET_ORGANIZATIONS_FAIL = 'organizations/GET_ORGANIZATIONS_FAIL';

const ORGANIZATION_SEARCH = 'organizations/ORGANIZATION_SEARCH';
const ORGANIZATION_SEARCH_SUCCESS = 'organizations/ORGANIZATION_SEARCH_SUCCESS';
const ORGANIZATION_SEARCH_FAIL = 'organizations/ORGANIZATION_SEARCH_FAIL';

const SELECT_ORGANIZATION = 'organizations/SELECT_ORGANIZATION';
const RESET = 'organizations/RESET';

const initialState = {
  organizations: [],
  passwords: [],
  organizationsLoading: false,
  organizationsLoaded: false,
  organizationsLoadingError: undefined,
  selectedOrganization: undefined,

  // search values
  searchLoading: false,
  searchLoaded: false,
  searchLoadingError: undefined,
  searchResults: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_ORGANIZATION:
      return {
        ...state,
        selectedOrganization: action.organization,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export function selectOrganization(organization) {
  return (dispatch) => {
    dispatch({
      type: SELECT_ORGANIZATION,
      organization,
    });
    dispatch(loadOrganizationPasswords());
  };
}

export function reset() {
  return {
    type: RESET,
  };

}
