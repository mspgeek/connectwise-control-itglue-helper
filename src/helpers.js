/* global __DEV__ */
/* global __CORS_ANYWHERE__ */
import ITGlue from 'node-itglue';

import {SETTING_TOKEN, SETTING_REDUX, CORS_ANYWHERE} from './strings';

/**
 * @param {string} key
 * @param {string} value
 */
export function setSCSettingValue(key, value) {
  try {
    if (__DEV__) {
      window.localStorage.setItem(key, value);
    } else {
      window.external.setSettingValue(key, value);
    }
  } catch (e) {
    console.error('setSCSettingValue', e);
  }
}

/**
 * @param {string} key
 */
export function getSCSettingValue(key) {
  let value;
  try {
    if (__DEV__) {
      value = window.localStorage.getItem(key);
    } else {
      value = window.external.getSettingValue(key);
    }
  } catch (e) {
    console.error('getSCSettingValue', e);
  }
  return value;
}

/**
 * @param {string} key
 */
export function deleteSCSettingValue(key) {
  try {
    if (__DEV__) {
      window.localStorage.setItem(key, '');
    } else {
      window.external.setSettingValue(key, '');
    }
  } catch (e) {
    console.error('deleteSCSettingValue', e);
  }
}

// @TODO first argument is domain, parse domain?
export function sendCredentials(username, password) {
  try {
    if (__DEV__) {
      alert(`send credentials: ${username}:${password}`);
    } else {
      window.external.sendCredentials(null, username, password);
    }
  } catch (e) {
  }
}

export function sendText(text) {
  try {
    if (__DEV__) {
      alert(`typing text ${text}`);
    } else {
      window.external.sendText(text);
    }
  } catch (e) {

  }
}

export function saveToken(token) {
  console.log('saveToken', token);
  if (token) {
    setSCSettingValue(SETTING_TOKEN, token);
  } else {
    setSCSettingValue(SETTING_TOKEN, '');
  }

}

export function getSavedToken() {
  const token = getSCSettingValue(SETTING_TOKEN);
  console.log('getSavedToken', token);
  return token;
}

export function deleteToken() {
  deleteSCSettingValue(SETTING_TOKEN);
}

export function saveStore(store) {
  // @TODO this doesn't work live
  // this is too big?
  setSCSettingValue(SETTING_REDUX, JSON.stringify(store));
}

export function saveTokenFromStore(store) {
  const {auth: {token}} = store;
  saveToken(token);
}

export function getStore() {
  try {
    return JSON.parse(getSCSettingValue(SETTING_REDUX));
  } catch (err) {
    return undefined;
  }
}

export function clearStore() {
  setSCSettingValue(SETTING_REDUX, '');
}

/**
 * @param token
 * @returns {Promise<boolean>}
 */
export function verifyToken(token) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({path: '/organizations'})
    .then(() => true)
    .catch(() => false);
}

export function getOrganizationPasswords({token, orgId}) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({
    path: `/organizations/${orgId}/relationships/passwords`,
    params: {
      'page[size]': 1000,
      'page[number]': 1,
      'sort': 'name',
    },
  })
    .then(results => results.data.map((password) => ({
      // shape match
      // class, class_name, id, name, username, hint, organization_name
      id: password.id,
      class: 'password',
      class_name: 'Password',
      orgId: password.attributes['organization-id'],
      organization_name: password.attributes['organization-name'],
      name: password.attributes.name,
      username: password.attributes.username,
      category: password.attributes['password-category-name'],
    })));
}

export function getPasswordById({token, passwordId, showPassword = false}) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({path: `/passwords/${passwordId}`, params: {'show_password': showPassword}})
    .then(result => {
      return result.data;
    });
}

export function getItGlueJsonWebToken({subdomain, otp, email, password}) {
  const config = {
    mode: 'user',
    companyUrl: `https://${subdomain}.itglue.com`,
    user: {
      email,
      password,
      otp,
    },
  };

  if (__CORS_ANYWHERE__) {
    config.companyUrl = `${CORS_ANYWHERE}${config.companyUrl}`;
  }

  const itg = new ITGlue(config);

  return itg.getItGlueJsonWebToken({email, password, otp});
}

export function getSearch({subdomain, token, searchText, kind = 'organizations,passwords', orgId}) {
  const config = {
    companyUrl: `https://${subdomain}.itglue.com`,
    token,
    mode: 'user-bearer',
  };

  if (__CORS_ANYWHERE__) {
    config.companyUrl = `${CORS_ANYWHERE}${config.companyUrl}`;
  }
  const itg = new ITGlue(config);

  return itg.search({
    query: searchText,
    limit: 50,
    kind,
    related: true,
    filter_organization_id: orgId,
  });
}
