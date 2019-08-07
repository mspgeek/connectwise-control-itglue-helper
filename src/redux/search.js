/**
 * Created by kgrube on 8/1/2019
 */
import {getSearch} from '../helpers';

const LOAD_SEARCH = 'search/LOAD_SEARCH';
const LOAD_SEARCH_SUCCESS = 'search/LOAD_SEARCH_SUCCESS';
const LOAD_SEARCH_FAIL = 'search/LOAD_SEARCH_FAIL';

const SET_SEARCH_TEXT = 'search/SET_SEARCH_TEXT';
const SET_SEARCH_CONTEXT = 'search/SET_SEARCH_CONTEXT';
const SHOW_SEARCH_RESULT = 'search/SHOW_SEARCH_RESULT';
const HIDE_SEARCH_RESULT = 'search/HIDE_SEARCH_RESULT';
const SET_ACTIVE_COMPONENT = 'search/SET_ACTIVE_COMPONENT';

const SELECT_PASSWORD = 'search/SELECT_PASSWORD';
const DESELECT_PASSWORD = 'search/DESELECT_PASSWORD';
const SELECT_ORGANIZATION = 'search/SELECT_ORGANIZATION';
const DESELECT_ORGANIZATION = 'search/DESELECT_ORGANIZATION';

const RESET = 'search/RESET';

const initialState = {
  searchText: '',
  searchResults: [],

  searchLoading: false,
  searchLoaded: false,

  searchResultOpen: false,
  // the context in which to search
  // 'global' => use /search.json
  // 'organization' => include filter_organization_id
  searchContext: 'global', // ['global', 'organization']
  selectedOrganization: undefined,
  selectedPassword: undefined,
  selectedType: undefined, // ['password','organization']

  activeComponent: 'header',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_SEARCH:
      return {
        ...state,
        searchResults: [],
        searchLoading: true,
        searchLoaded: false,
      };
    case LOAD_SEARCH_SUCCESS:
      return {
        ...state,
        searchResults: action.result,
        searchLoading: false,
        searchLoaded: true,
      };
    case LOAD_SEARCH_FAIL:
      return {
        ...state,
        searchResults: [],
        searchLoading: false,
        searchLoaded: false,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      };
    case SELECT_PASSWORD:
      return {
        ...state,
        selectedType: 'password',
        selectedPassword: action.password,
      };
    case DESELECT_PASSWORD:
      return {
        ...state,
        selectedType: undefined,
        selectedPassword: undefined,
      };
    case SELECT_ORGANIZATION:
      return {
        ...state,
        selectedType: 'organization',
        selectedOrganization: action.password,
      };
    case DESELECT_ORGANIZATION:
      return {
        ...state,
        selectedType: undefined,
        selectedOrganization: undefined,
      };
    case HIDE_SEARCH_RESULT:
      return {
        ...state,
        searchResultOpen: false,
      };
    case SHOW_SEARCH_RESULT:
      return {
        ...state,
        searchResultOpen: true,
      };
    case SET_SEARCH_CONTEXT:
      return {
        ...state,
        searchContext: action.searchContext,
      };
    case SET_ACTIVE_COMPONENT:
      return {
        ...state,
        activeComponent: action.activeComponent,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export function loadSearch({searchText}) {
  return (dispatch, getState) => {
    const {
      auth: {user: {subdomain}, token},
      search: {searchContext, selectedOrganization},
    } = getState();

    const searchOptions = {subdomain, token, searchText};

    if (searchContext === 'organization') {
      searchOptions.orgId = selectedOrganization.id;
      searchOptions.kind = 'passwords';
    } else {
      searchOptions.kind = 'organizations,passwords';
    }

    return dispatch({
      types: [LOAD_SEARCH, LOAD_SEARCH_SUCCESS, LOAD_SEARCH_FAIL],
      promise: getSearch(searchOptions),
    });
  };
}

export function setSearchText(searchText) {
  return {
    type: SET_SEARCH_TEXT,
    searchText,
  };
}

export function showSearchResult() {
  return {
    type: SHOW_SEARCH_RESULT,
  };
}

export function hideSearchResult() {
  return {
    type: HIDE_SEARCH_RESULT,
  };
}

export function selectPassword(password) {
  return {
    type: SELECT_PASSWORD,
    password,
  };
}

export function deselectPassword() {
  return {
    type: DESELECT_PASSWORD,
  };
}

export function selectOrganization(organization) {
  return {
    type: SELECT_ORGANIZATION,
    organization,
  };
}

export function deselectOrganization() {
  return {
    type: DESELECT_ORGANIZATION,
  };
}

export function toggleSearchContext() {
  return (dispatch, getState) => {
    const {selectedItem, searchContext} = getState().search;
    if (selectedItem) {
      return dispatch({
        type: SET_SEARCH_CONTEXT,
        searchContext: 'global',
      });
    }
  };
}

export function setActiveComponent(activeComponent) {
  return {
    type: SET_ACTIVE_COMPONENT,
    activeComponent,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
