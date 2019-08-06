/* global __DEV__ */
/* global __CORS_ANYWHERE__ */
import filter from 'lodash/filter';
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
  setSCSettingValue(SETTING_TOKEN, token);
}

export function getSavedToken() {
  console.log('getSavedToken');
  return getSCSettingValue(SETTING_TOKEN);
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
  setSCSettingValue(SETTING_TOKEN, token);
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
 * @param subdomain
 * @param email
 * @param password
 * @param otp
 * @returns {Promise<{string}>} token
 */
export function itgLogin(subdomain, email, password, otp) {
  const itg = new ITGlue({
    mode: 'user',
    user: {
      email, password, otp,
    },
    companyUrl: `https://${subdomain}.itglue.com`,
  });

  return itg.getItGlueJsonWebToken({email, password, otp});
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

export function getOrganizations(token) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({
    path: '/organizations',
    params: {
      'page[size]': 1000,
      'filter[psa_integration_type]': 'manage',
    },
  })
  // make the data returned usable
    .then(results => results.data.map(org => ({
      orgId: org.id,
      name: org.attributes.name,
      shortName: org.attributes['short-name'],
    })));
}

export function getOrganizationPasswords(token, orgId) {
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

export function getAndSendPassword(token, passwordId) {
  return getPasswordById(token, passwordId, true)
    .then(result => {
      console.log('result is', result);
      const {username, password} = result.attributes;
      sendCredentials(username, password);
      return result;
    });
}

export function searchOrganization(subdomain, token, searchText) {
  const config = {
    companyUrl: `https://${subdomain}.itglue.com`,
    token,
    mode: 'user-bearer',
  };

  if (__CORS_ANYWHERE__) {
    config.companyUrl = `${CORS_ANYWHERE}${config.companyUrl}`;
  }
  const itg = new ITGlue(config);

  return itg.search({query: searchText, limit: 25})
    .then(result => filter(result, el => el.class === 'organization'))
    .then(result => result.map(org => ({
      orgId: org.id,
      name: org.name,
      shortName: org.short_name,
    })))
    .then(result => result.map(org => ({value: org.orgId, label: org.shortName})));
}

export function getItGlueJsonWebToken(subdomain, otp, email, password) {
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

export function getSearch(subdomain, token, searchText) {
  const config = {
    companyUrl: `https://${subdomain}.itglue.com`,
    token,
    mode: 'user-bearer',
  };

  if (__CORS_ANYWHERE__) {
    config.companyUrl = `${CORS_ANYWHERE}${config.companyUrl}`;
  }
  const itg = new ITGlue(config);

  return itg.search({query: searchText, limit: 10, kind: 'passwords,organizations'});
  // .then(result => filter(result, el => el.class === 'organization'))
  // .then(result => result.map(org => ({
  //   orgId: org.id,
  //   name: org.name,
  //   shortName: org.short_name,
  // })))
  // .then(result => result.map(org => ({value: org.orgId, label: org.shortName})));
}
