/* global __DEV__ */
import {saveStore, saveTokenFromStore} from '../helpers';
import {showAlert} from '../redux/alert';

export function promiseThunkMiddleware() {
  return ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const {promise, types, ...rest} = action;

    // @TODO save state to local storage?
    // put after thunking middleware

    saveStore(getState());
    saveTokenFromStore(getState());


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
        next({...rest, error, type: FAILURE});
        console.error('MIDDLEWARE ERROR', error);
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
