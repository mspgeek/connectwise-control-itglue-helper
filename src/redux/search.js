/**
 * Created by kgrube on 8/1/2019
 */
import {getSearch} from '../helpers';

const LOAD_SEARCH = 'search/LOAD_SEARCH';
const LOAD_SEARCH_SUCCESS = 'search/LOAD_SEARCH_SUCCESS';
const LOAD_SEARCH_FAIL = 'search/LOAD_SEARCH_FAIL';

const SET_SEARCH_TEXT = 'search/SET_SEARCH_TEXT';
const SELECT_ITEM = 'search/SELECT_ITEM';
const DESELECT_ITEM = 'search/DESELECT_ITEM';
const SHOW_SEARCH_RESULT = 'search/SHOW_SEARCH_RESULT';
const HIDE_SEARCH_RESULT = 'search/HIDE_SEARCH_RESULT';
const RESET = 'search/RESET';

const initialState = {
  searchText: '',
  searchResults: [],

  searchLoading: false,
  searchLoaded: false,

  searchResultOpen: false,
  // the context in which to search
  // 'global' => use /search.json
  // 'organization' => filter passwords
  searchContext: 'global', // ['global', 'organization']
  selectedItem: undefined,
  selectedType: undefined, // ['password','organization']
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
    case SELECT_ITEM:
      return {
        ...state,
        selectedItem: action.item,
        selectedType: action.item.class,
      };
    case DESELECT_ITEM:
      return {
        ...state,
        selectedItem: undefined,
        selectedType: undefined,
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
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export function loadSearch(searchText) {
  return (dispatch, getState) => {
    const {auth: {user: {subdomain}, token}} = getState();

    return dispatch({
      types: [LOAD_SEARCH, LOAD_SEARCH_SUCCESS, LOAD_SEARCH_FAIL],
      promise: getSearch(subdomain, token, searchText),
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

export function selectItem(item) {
  return {
    type: SELECT_ITEM,
    item,
  };
}

export function deselectItem() {
  return {
    type: DESELECT_ITEM,
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

export function reset() {
  return {
    type: RESET,
  };
}
