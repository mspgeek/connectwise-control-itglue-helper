/* global __DEV__ */
import {saveStore, saveTokenFromStore} from '../helpers';
import {showAlert} from '../redux/alert';
import {logout} from '../redux/auth';
import isArray from 'lodash/isArray';

export function promiseThunkMiddleware() {
  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const {promise, types, ...rest} = action;

    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({...rest, type: REQUEST});

    /* eslint-disable promise/no-callback-in-promise */
    Promise.all([promise])
      .then(result => {
        next({...rest, result: result[0], type: SUCCESS});
      })
      .catch(error => {
        let raisedError = error;
        if (isArray(error)) {
          raisedError = error[0];
        }
        next({...rest, error: raisedError, type: FAILURE});

        if (raisedError.status === 401) {
          dispatch(logout());
        }

        console.error('MIDDLEWARE ERROR', raisedError);
      });
  };
}

export function errorHandler() {
  return ({dispatch, getState}) => next => action => {
    if (action.error) {
      dispatch(showAlert(action.error));
    }
    return next(action);
  };
}

export function cacheHandler() {
  return ({dispatch, getState}) => next => action => {
    const oldState = getState();
    const oldToken = getState().auth.token;

    next(action);

    const newState = getState();
    const newToken = getState().auth.token;

    if (oldToken !== newToken) {
      saveTokenFromStore(getState());
    }
    // @TODO make this semi-intelligent
    saveStore(getState());
  };
}