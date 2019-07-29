/* global __DEV__ */
/* global __IE8TEST__ */
// import ITGlue from 'node-itglue'; // this module has un-polyfilled code and won't load on IE8
import ITGlue from './node-itglue-jquery';  // this is a rewrite using jquery 1.12

/**
 * Creates cookies
 * @param {string} cname Name of the cookie
 * @param {string} cvalue Cookie value
 */
export function setCookie(cname, cvalue) {
  try {
    if (__DEV__ || __IE8TEST__) {
      window.localStorage.setItem(cname, cvalue);
      console.log('localStorage.setItem', cname, cvalue);
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
    if (__DEV__ || __IE8TEST__) {
      console.log('localStorage.getItem', cname);
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
    if (__DEV__ || __IE8TEST__) {
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
    if (__DEV__ || __IE8TEST__) {
      alert(`send credentials: ${username}:${password}`);
    } else {
      window.external.sendCredentials(null, username, password);
    }
  } catch (e) {
    //Do something: Tried worked on local but didn't work on live :(
  }
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
  });
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
  });
}

export function getPassword(token, orgId, id) {
  const itg = new ITGlue({
    mode: 'bearer',
    token,
  });

  return itg.get({path: `/organizations/${orgId}/relationships/passwords/${id}`})
    .then(result => result.data);
}
