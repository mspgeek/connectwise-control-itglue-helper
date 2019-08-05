import {createStore, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducer';
import {promiseThunkMiddleware, errorHandler} from './middleware';
import {getSavedToken, getStore} from '../helpers';

// load saved state
const initialState = getStore();

console.log('initialState', initialState);

// if ((initialState && initialState.auth) && !initialState.auth.loggedIn) {
//   initialState = {};
// }

const middleware = [promiseThunkMiddleware(), errorHandler()];

export default function create() {
  if (initialState) {
    return createStore(
      reducer,
      initialState,
      composeWithDevTools(applyMiddleware(...middleware)));
  }
  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware)));
}
