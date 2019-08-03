import {combineReducers} from 'redux';

import auth from './auth';
import alert from './alert';
import organizations from './organizations';
import passwords from './passwords';
import search from './search';

export default combineReducers({
  auth,
  alert,
  organizations,
  passwords,
  search,
});
