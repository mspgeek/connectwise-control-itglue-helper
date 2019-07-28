/* global __DEV__ */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import 'console-polyfill';
import 'bootstrap';
import './app.less';
import $ from 'jquery';

import {
  deleteCookie,
  getCookie,
  itgLogin,
  sendCredentials,
  setCookie,
  verifyToken,
} from './cwc-helpers';


import State from './state';
import {SETTING_TOKEN} from './strings';

const initialState = {
  token: undefined,
  loginFail: false,
  loggedIn: false,
};

const state = new State(initialState);

$(document).on('ready', () => {
  // bind state change to renderer
  state.on('change', renderer);

  const loginForm = $('#login-form');
  const results = $('#results');
  const stateLog = $('#state-log');
  const loginButton = $('#login-button');
  const loginAlert = $('#login-alert');

  const token = getCookie(SETTING_TOKEN);
  state.setState({token});
  console.log('token is', token);

  if (token && token.length > 0) {
    console.log('saved token detected, verifying');
    verifyToken(token)
      .then(result => {
        console.log('verify result', result);

        if (result) {
          state.setState({token, loggedIn: true, loginFail: false});
        } else {
          state.setState({token: undefined, loggedIn: false, loginFail: true});
        }
      })
      .catch(err => {
        console.log('verify error', err);
        state.setState({token: undefined, loggedIn: false, loginFail: true});
      });
  } else {
    loginForm.removeClass('hidden');
  }

  loginButton.on('click', clickLoginButton);

  stateLog.empty().append($('<pre>').text(JSON.stringify(state.state, null, 2)));

  function renderer(newState) {
    // if logged in
    if (newState.loggedIn) {
      loginForm.addClass('hidden');
    } else {
      loginForm.removeClass('hidden');
    }

    if (newState.loginFail) {
      loginAlert.removeClass('hidden');
      $('#login-alert p').text('Login failure.');
    } else {
      loginAlert.addClass('hidden');
    }

    stateLog.empty().append($('<pre>').text(JSON.stringify(newState, null, 2)));
  }

  function clickLoginButton(event) {
    event.preventDefault();
    const companyUrl = $('input[name=companyUrl]').val();
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();
    const otp = $('input[name=otp]').val();

    itgLogin(companyUrl, email, password, otp)
      .then(result => {
        results.append($('<div>').text(JSON.stringify(result, null, 2)));
        state.setState({loggedIn: true, loginFail: false});
        setCookie(SETTING_TOKEN, result);
      })
      .catch(err => {
        results.append($('<div>').text(JSON.stringify(err, null, 2)));
        state.setState({token: undefined, loggedIn: false, loginFail: true});
        setCookie(SETTING_TOKEN, undefined);
      });
  }


  $('#clear-local-storage').on('click', event => {
    event.preventDefault();
    window.localStorage.clear();
    state.setState(initialState);
  });
});
