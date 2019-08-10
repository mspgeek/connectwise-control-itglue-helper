import {createStore, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducer';
import {promiseThunkMiddleware, errorHandler, cacheHandler} from './middleware';
import {getSavedToken, getStore} from '../helpers';
import {initialState as alert} from './alert';
import {initialState as auth} from './auth';
import {initialState as passwords} from './passwords';
import {initialState as search} from './search';

// load saved state
let initialState = getStore();

if (!initialState) {
  initialState = {
    alert, auth, passwords, search,
  };
}

const token = getSavedToken();

console.log('initialState', initialState);

const middleware = [promiseThunkMiddleware(), errorHandler(), cacheHandler()];

export default function create() {
  return createStore(
    reducer,
    {
      ...initialState,
      // strip auth variables to prevent weird login pending issues
      auth: {
        user: {
          ...initialState.auth.user,
        },
        token,
      },
    },
    composeWithDevTools(applyMiddleware(...middleware)));
}
