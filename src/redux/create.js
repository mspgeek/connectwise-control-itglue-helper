import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducer';
import middleware from './middleware';

export default function create(initialState = {}) {
  console.log('initial state: ', initialState);
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(middleware())));
}
