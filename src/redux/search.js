/**
 * Created by kgrube on 8/1/2019
 */
import {getSearch} from '../helpers';
import {deselectPassword as passwordDeselect} from './passwords';

const LOAD_SEARCH = 'search/LOAD_SEARCH';
const LOAD_SEARCH_SUCCESS = 'search/LOAD_SEARCH_SUCCESS';
const LOAD_SEARCH_FAIL = 'search/LOAD_SEARCH_FAIL';

const SET_SEARCH_TEXT = 'search/SET_SEARCH_TEXT';
const SET_SEARCH_CONTEXT = 'search/SET_SEARCH_CONTEXT';
const SHOW_SEARCH_RESULT = 'search/SHOW_SEARCH_RESULT';
const HIDE_SEARCH_RESULT = 'search/HIDE_SEARCH_RESULT';
const SET_ACTIVE_COMPONENT = 'search/SET_ACTIVE_COMPONENT';
const CLEAR_RESULTS = 'search/CLEAR_RESULTS';

const SELECT_PASSWORD = 'search/SELECT_PASSWORD';
const DESELECT_PASSWORD = 'search/DESELECT_PASSWORD';
const SELECT_ORGANIZATION = 'search/SELECT_ORGANIZATION';
const DESELECT_ORGANIZATION = 'search/DESELECT_ORGANIZATION';

const RESET = 'search/RESET';

export const initialState = {
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
        searchContext: 'organization',
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
        searchContext: 'organization',
        selectedType: 'organization',
        selectedOrganization: action.organization,
      };
    case DESELECT_ORGANIZATION:
      return {
        ...state,
        selectedType: undefined,
        selectedOrganization: undefined,
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        searchResults: [],
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

export function loadSearch() {
  return (dispatch, getState) => {
    const {
      auth: {user: {subdomain}, token},
      search: {searchContext, selectedOrganization, searchText},
      passwords: {password},
    } = getState();

    const searchOptions = {subdomain, token, searchText};

    if (searchContext === 'organization') {
      searchOptions.orgId = (selectedOrganization && selectedOrganization.id) || password.attributes['organization-id'];
      searchOptions.kind = 'passwords';
    } else {
      searchOptions.kind = 'organizations,passwords';
    }

    return dispatch({
      types: [LOAD_SEARCH, LOAD_SEARCH_SUCCESS, LOAD_SEARCH_FAIL],
      promise: getSearch(searchOptions)
        .then(results => {
          dispatch(showSearchResult());
          return results;
        }),
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
  return (dispatch, getState) => {
    return dispatch({
      type: DESELECT_PASSWORD,
    });
  };
}

export function selectOrganization(organization) {
  return (dispatch, getState) => {
    dispatch({
      type: SELECT_ORGANIZATION,
      organization,
    });
    dispatch(setActiveComponent('organization'));
    dispatch(setSearchContext({searchContext: 'organization'}));
    dispatch(setSearchText(''));
    dispatch(clearSearchResults());

  };
}

export function deselectOrganization() {
  return (dispatch) => {
    dispatch(passwordDeselect());
    dispatch({
      type: DESELECT_ORGANIZATION,
    });
  };
}

export function clearSearchResults() {
  return {
    type: CLEAR_RESULTS,
  };
}

export function setSearchContext({searchContext}) {
  return (dispatch) => {
    dispatch({
      type: SET_SEARCH_CONTEXT,
      searchContext,
    });
    dispatch(loadSearch());
  };
}

export function toggleSearchContext() {
  return (dispatch, getState) => {
    // @TODO finish this
    const {selectedType, searchContext} = getState().search;
    if (selectedType) {
      return dispatch(setSearchContext({searchContext: searchContext === 'global' ? 'organization' : 'global'}));
    }
    return dispatch(setSearchContext({searchContext: 'global'}));
  };
}

export function handleNavigation() {
  return (dispatch, getState) => {
    const {search, activeComponent: currentComponent} = getState().search;

    if (currentComponent === 'utils') {
      dispatch(setActiveComponent('header'));
    } else if (currentComponent === 'header') {
      dispatch(setActiveComponent('utils'));
    } else if (currentComponent === 'organization') {
      // on back from org, show global results
      dispatch(setActiveComponent('header'));
      dispatch(setSearchContext({searchContext: 'global'}));
      dispatch(deselectOrganization());
    } else if (currentComponent === 'password') {
      // on back from password, show org results
      dispatch(setActiveComponent('organization'));
      dispatch(setSearchContext({searchContext: 'organization'}));
      dispatch(showSearchResult());
      dispatch(deselectPassword());
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
