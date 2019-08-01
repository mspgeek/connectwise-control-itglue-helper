import {createStore, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducer';
import {promiseThunkMiddleware, errorHandler} from './middleware';
import {getStore} from '../helpers';

// load saved state
let initialState = getStore();

console.log('saved state: ', initialState);

if (!initialState.auth.loggedIn) {
  initialState = {};
}

const middleware = [promiseThunkMiddleware(), errorHandler()];

export default function create() {
  console.log('initial state: ', initialState);
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)));
}
