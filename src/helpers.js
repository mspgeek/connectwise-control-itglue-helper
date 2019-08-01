/* global __DEV__ */
/* global __CORS_ANYWHERE__ */

import ITGlue from 'node-itglue';
import {SETTING_TOKEN, SETTING_REDUX} from './strings';
import filter from 'lodash/filter';

const CORS_ANYWHERE = 'https://cwc-cors.herokuapp.com/';

/**
 * Creates cookies
 * @param {string} cname Name of the cookie
 * @param {string} cvalue Cookie value
 */
export function setCookie(cname, cvalue) {
  try {
    if (__DEV__) {
      window.localStorage.setItem(cname, cvalue);
      // console.log('localStorage.setItem', cname, cvalue);
    } else {
      window.external.setSettingValue(cname, cvalue);
    }
  } catch (e) {
    //Do something: Tried worked on local but didn't work on live :(
  }
}


/**
 * Get cookies
 * @param {string} cname Name of the cookie
 */
export function getCookie(cname) {
  let value;
  try {
    if (__DEV__) {
      // console.log('localStorage.getItem', cname);
      value = window.localStorage.getItem(cname);
    } else {
      value = window.external.getSettingValue(cname);
    }
  } catch (e) {
    //Do something: Tried worked on local but didn't work on live :(
  }
  return value;
}


/**
 * Delete cookie
 * @param {string} cname Cookie value
 */
export function deleteCookie(cname) {
  try {
    if (__DEV__) {
      window.localStorage.setItem(cname, '');
      console.log('localStorage.setItem', cname, '');
    } else {
      window.external.setSettingValue(cname, '');
    }
  } catch (e) {
    //Do something: Tried worked on local but didn't work on live :(
  }
}

export function sendCredentials(username, password) {
  try {
    if (__DEV__) {
      alert(`send credentials: ${username}:${password}`);
    } else {
      window.external.sendCredentials(null, username, password);
    }
  } catch (e) {
    //Do something: Tried worked on local but didn't work on live :(
  }
}

export function saveToken(token) {
  setCookie(SETTING_TOKEN, token);
}

export function getSavedToken() {
  return getCookie(SETTING_TOKEN);
}

export function deleteToken() {
  deleteCookie(SETTING_TOKEN);
}

export function saveStore(store) {
  setCookie(SETTING_REDUX, JSON.stringify(store));
}

export function getStore() {
  try {
    return JSON.parse(getCookie(SETTING_REDUX));
  } catch (err) {
    return undefined;
  }
}

export function clearStore() {
  setCookie(SETTING_REDUX, '');
}


/**
 * @param companyUrl
 * @param email
 * @param password
 * @param otp
 * @returns {Promise<{string}>} token
 */
export function itgLogin(companyUrl, email, password, otp) {
  const itg = new ITGlue({
    mode: 'user',
    user: {
      email, password, otp,
    },
    companyUrl,
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
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    });
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

export function getOrganizationPasswords(token, id) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({
    path: `/organizations/${id}/relationships/passwords`,
    params: {
      'page[size]': 1000,
      'page[number]': 1,
      'sort': 'name',
    },
  })
    .then(results => results.data.map((password) => ({
      passwordId: password.id,
      orgId: password.attributes['organization-id'],
      name: password.attributes.name,
      username: password.attributes.username,
      category: password.attributes['password-category-name'],
    })));
}

export function getPassword(token, orgId, passwordId) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({path: `/organizations/${orgId}/relationships/passwords/${passwordId}`})
    .then(result => result.data);
}

export function getAndSendPassword(token, orgId, passwordId) {
  return getPassword(token, orgId, passwordId)
    .then(result => {
      console.log('result is', result);
      const {username, password} = result.attributes;
      sendCredentials(username, password);
      return result;
    });
}

export function searchOrganization(companyUrl, token, searchText) {
  const config = {
    companyUrl,
    token,
    mode: 'user-bearer',
  };

  if (__CORS_ANYWHERE__) {
    config.companyUrl = config.companyUrl = `${CORS_ANYWHERE}${config.companyUrl}`;
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

export function getItGlueJsonWebToken(server, otp, email, password) {
  const config = {
    mode: 'user',
    companyUrl: server,
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
