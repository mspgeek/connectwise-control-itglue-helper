/**
 * Created by kgrube on 7/26/2019
 * This is a port of `node-itglue`
 */

/* global $ */
/* global __DEV__ */
/* global __IE8TEST__ */

const param = require('jquery-param');

/**
 * @typedef {Object} ResponseError
 * @property config
 * @property message
 * @property request
 * @property response
 * @property response.config
 * @property response.data
 * @property {array<{ITGlueError}>} response.data.errors
 * @property response.headers
 * @property response.request
 * @property response.status
 * @property response.statusText
 *
 */

/**
 * @typedef {Object} ITGlueError
 * @property {Object} source
 * @property status
 * @property title
 *
 */

const GET = 'get';
const POST = 'post';
const PATCH = 'patch';
const DELETE = 'delete';

const BASE_URL = 'https://api.itglue.com';
const BASE_URL_EU = 'https://api.eu.itglue.com';
const BASE_URL_MOBILE = 'https://api-mobile-prod.itglue.com/api';
const CORS_ANYWERE = 'https://cors-anywhere.herokuapp.com/';

const MODE_BEARER = 'bearer';
const MODE_USER = 'user';
const MODE_APIKEY = 'apikey';

/**
 *
 * @param config
 * @param [config.mode=apikey] ['apikey', 'bearer', 'user']
 * @param [config.apikey] specify to access API methods
 * @param [config.timeout=10000]
 * @param [config.eu=false]
 * @param [config.companyUrl] specify to get a bearer token
 * @param [config.token] specify authentication using a bearer token
 * @param [config.user]
 * @param [config.user.email]
 * @param [config.user.password]
 * @param {String} [config.user.otp] one time password for MFA -- must be a string
 * @returns {Promise<{}>}
 * @constructor
 */
function ITGlue({
  apikey, mode = MODE_APIKEY, timeout, eu, companyUrl, token, user: {email, password, otp} = {},
}) {
  if (!companyUrl && mode === MODE_USER) {
    throw `companyUrl must be defined in mode ${MODE_USER}`;
  }
  if (!token && mode === MODE_BEARER) {
    throw `token must be defined in mode ${MODE_BEARER}`;
  }
  if (!apikey && mode === MODE_APIKEY) {
    throw `apikey must be defined in mode ${MODE_APIKEY}`;
  }

  let baseURL = BASE_URL;
  if (eu) {
    baseURL = BASE_URL_EU;
  }

  this.config = {
    async: true,
    crossDomain: true,
    processData: false,
  };
  this.mode = mode;
  this.token = token;
  this.user = {email, password, otp};
  this.apikey = apikey;
  this.companyUrl = companyUrl;
  this.config.headers = {
    'cache-control': 'no-cache',
  };

  if (mode === MODE_USER) {
    this.config.baseURL = companyUrl;
    this.config.headers['content-type'] = 'application/json';
  } else if (mode === MODE_BEARER) {
    this.config.baseURL = BASE_URL_MOBILE;
    this.config.headers['authorization'] = `Bearer ${token}`;
    this.config.headers['content-type'] = 'application/vnd.api+json';
  } else {
    this.config.baseURL = baseURL;
    this.config.headers['x-api-key'] = apikey;
    this.config.headers['content-type'] = 'application/vnd.api+json';
  }
}

/**
 * @param path
 * @param [params]
 * @param [body]
 * @param method
 * @returns {Promise<{}>}
 * @throws {ResponseError}
 */
ITGlue.prototype.client = function ({path, params, body, method}) {
  return new Promise((resolve, reject) => {

    const config = {
      ...this.config,
      url: `${this.config.baseURL}${path}?${param(params)}`,
      method,
    };

    if (__DEV__ || __IE8TEST__) {
      config.url = `${CORS_ANYWERE}${config.url}`;
      config.headers['x-requested-with'] = 'jquery';
    }

    if (method === POST || method === PATCH) {
      config.data = JSON.stringify(body);
    }

    console.log(config);

    const request = $.ajax(config);
    return Promise.race([
      request.done(data => {
        return resolve(data);
      }),
      request.fail((jqXHR, textStatus) => {
        if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.error_message) {
          return reject(jqXHR.responseJSON.error_message);
        }
        return reject(`${jqXHR.status}/${textStatus}`);
      }),
    ]);
  });
};

ITGlue.prototype.handler = function (options) {
  if (this.mode === MODE_APIKEY) {
    return this.client(options);
  }
  if (this.mode === MODE_USER && !this.token) {
    return this.getItGlueJsonWebToken(this.user)
      .then(token => {
        this.token = token;
        this.setAuthenticationMode(MODE_BEARER);
        return this.client(options);
      });
  } else if (this.mode === MODE_USER && this.token) {
    this.setAuthenticationMode(MODE_BEARER);
    return this.client(options);
  }
  if (this.mode === MODE_BEARER) {
    return this.client(options);
  }
};

ITGlue.prototype.get = function ({path, params}) {
  return this.handler({method: GET, path, params});
};

ITGlue.prototype.post = function ({path, params, body}) {
  return this.handler({method: POST, path, params, body});
};

ITGlue.prototype.patch = function ({path, params, body}) {
  return this.handler({method: PATCH, path, params, body});
};

ITGlue.prototype.delete = function ({path, params}) {
  return this.handler({method: DELETE, path, params});
};

/**
 *
 * @param [mode] ['apikey', 'bearer', 'user']
 */
ITGlue.prototype.setAuthenticationMode = function (mode = 'apikey') {
  this.mode = mode;
  const {apikey, companyUrl, token} = this;
  if (mode === MODE_USER) {
    this.config.baseURL = companyUrl;
    this.config.headers['content-type'] = 'application/json';
  } else if (mode === MODE_BEARER) {
    this.config.baseURL = BASE_URL_MOBILE;
    this.config.headers['authorization'] = `Bearer ${token}`;
    this.config.headers['content-type'] = 'application/vnd.api+json';
  } else {
    this.config.baseURL = baseURL;
    this.config.headers['x-api-key'] = apikey;
    this.config.headers['content-type'] = 'application/vnd.api+json';
  }
};

/**
 * @param email
 * @param password
 * @param otp
 * @returns {Promise<{String}>}
 * @constructor
 */
ITGlue.prototype.getItGlueJsonWebToken = function ({email, password, otp}) {
  return this.client({
    method: POST,
    path: '/login',
    params: {generate_jwt: 1, sso_disabled: 1},
    body: {
      user: {email, password, otp_attempt: otp},
    },
  })
    .then(result => {
      return result.token;
    })
    .then(token => {
      return this.refreshItGlueJsonWebToken({token});
    })
    .then(token => {
      return token;
    });
};

/**
 * @param token
 * @returns {Promise<{String}>}
 */
ITGlue.prototype.refreshItGlueJsonWebToken = function ({token}) {
  return this.client({
    method: GET,
    path: '/jwt/token',
    params: {
      refresh_token: token,
    },
  })
    .then(result => {
      return result.token;
    });
};


/**
 * @type {ITGlue}
 */
module.exports = ITGlue;
