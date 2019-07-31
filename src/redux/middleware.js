export default function middleware() {
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

    //@TODO save state to local storage?

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
