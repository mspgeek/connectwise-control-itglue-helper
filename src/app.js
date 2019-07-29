/* global __DEV__ */
/* global __IE8TEST__ */
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import 'console-polyfill';
// import 'bootstrap';
// import './app.less';
import $ from 'jquery';
import '../libs/bootstrap3-typeahead.min';

import {
  deleteCookie,
  getCookie,
  itgLogin,
  sendCredentials,
  setCookie,
  verifyToken,
  getOrganizations,
  getOrganizationPasswords,
  getPassword,
} from './cwc-helpers';


import State from './state';
import {SETTING_TOKEN, SEND_CREDENTIALS} from './strings';

const initialState = {
  token: undefined,
  loginFail: false,
  loggedIn: false,
  organizations: [],
  organizationsLoaded: false,
  organizationShortNames: [],
  organizationSelected: undefined,
  organizationPasswords: [],
  organizationPasswordsLoaded: false,
};

const state = new State(initialState);

// ui elements
let loginForm;
let results;
let stateLog;
let loginButton;
let loginAlert;
let clientSelect;
let organizationSearch;
let clientPasswords;

// data
let token;

$(document).on('ready', () => {
  // bind state change to renderer
  state.on('change', renderer);

  // create jQuery objects
  loginForm = $('#login-form');
  results = $('#results');
  stateLog = $('#state-log');
  loginButton = $('#login-button');
  loginAlert = $('#login-alert');
  clientSelect = $('#client-select');
  organizationSearch = $('#organization-search');
  clientPasswords = $('#client-passwords');

  // initialize state
  token = getCookie(SETTING_TOKEN);
  state.setState({token});

  // bind event handlers
  loginButton.on('click', clickLoginButton);
  $('#clear-local-storage').on('click', clickClearLocalStorage);

  // set up logger
  if (__DEV__ || __IE8TEST__) {
    stateLog.empty().append($('<pre>').text(JSON.stringify(state.state, null, 2)));
  }

  // start
  checkSavedToken();

});

function renderer({oldState, newState}) {
  // if logged in, hide the login form
  if (newState.loggedIn) {
    loginForm.addClass('hidden');
  } else {
    loginForm.removeClass('hidden');
  }

  // if login failed, show an alert
  if (newState.loginFail) {
    loginAlert.removeClass('hidden');
    $('#login-alert p').text('Login failure.');
  } else {
    loginAlert.addClass('hidden');
  }

  if (newState.organizationsLoaded) {
    clientSelect.removeClass('hidden');
    // initialize search
    organizationSearch.typeahead({
      source: newState.organizationShortNames,
      afterSelect: (val) => handleSelectOrganization(val),
    });
  } else {
    organizationSearch.typeahead('destroy');
    clientSelect.addClass('hidden');
  }

  if (newState.organizationSelected && !oldState.organizationSelected) {
    handleLoadOrganizationPasswords(newState.organizationSelected);
  }

  if (newState.organizationPasswordsLoaded && !oldState.organizationPasswordsLoaded) {
    clientPasswords.removeClass('hidden');
    const columns = ['name', 'username', 'category', SEND_CREDENTIALS];
    insertDataToTable($('#client-passwords table'), newState.organizationPasswords, columns);
  } else {
    clientPasswords.addClass('hidden');
  }

  // log new state
  if (__DEV__ || __IE8TEST__) {
    stateLog.empty().append($('<pre>').text(JSON.stringify(newState, null, 2)));
  }
}


function clickClearLocalStorage(event) {
  event.preventDefault();
  window.localStorage.clear();
  state.setState(initialState);
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
      handleLoadOrganizations();
    })
    .catch(err => {
      results.append($('<div>').text(JSON.stringify(err, null, 2)));
      state.setState({token: undefined, loggedIn: false, loginFail: true});
      setCookie(SETTING_TOKEN, undefined);
    });
}

/**
 * Verify saved token is still valid
 */
function checkSavedToken() {
  if (token && token.length > 0) {
    console.log('saved token detected, verifying');
    verifyToken(token)
      .then(verified => {
        console.log('verify result', verified);

        if (verified) {
          state.setState({token, loggedIn: true, loginFail: false});
          handleLoadOrganizations();
        } else {
          state.setState({token: undefined, loggedIn: false, loginFail: true});
          deleteCookie(SETTING_TOKEN);
        }
      })
      .catch(err => {
        console.log('verify error', err);
        state.setState({token: undefined, loggedIn: false, loginFail: true});
      });
  } else {
    loginForm.removeClass('hidden');
  }
}

function handleLoadOrganizations() {
  getOrganizations(token)
    .then(orgs => {
      console.log(orgs);
      state.setState({
        organizations: orgs.data || [],
        organizationsLoaded: true,
        organizationShortNames: orgs.data.map(org => org.attributes['short-name']),
      });
    })
    .catch(err => {
      console.log(err);

    });
}

function handleSelectOrganization(val) {
  const organizations = state.state.organizations;

  let result;
  organizations.forEach(org => {
    if (org.attributes['short-name'] === val) {
      result = org;
    }
  });

  state.setState({organizationSelected: result});
}

function handleLoadOrganizationPasswords(organization) {
  const orgId = organization.id;
  getOrganizationPasswords(token, orgId)
    .then(passwords => {
      const passwordMapped = (passwords.data || []).map(password => {
        const {id, attributes: {name, ['password-category-name']: category, username}} = password;
        return {id, name, category, username};
      });
      state.setState({
        organizationPasswords: passwordMapped,
        organizationPasswordsLoaded: true,
      });
    })
    .catch(err => {
      console.log('error loading passwords', err);
    });
}

function insertDataToTable(target, data, columns) {
  const result = $('<tbody>');

  data.forEach(row => {
    const newRow = $('<tr>');
    columns.forEach(column => {
      if (column === SEND_CREDENTIALS) {
        newRow.append(
          $('<td>')
            .append(
              $('<button class="btn btn-info">')
                .text('Send')
                .data('id', row['id'])
                .on('click', handleSendCredentialsButton)));
      } else {
        newRow.append($('<td>').text(row[column]));
      }
    });
    result.append(newRow);
  });

  // $('#client-passwords table tbody')
  target.append(result);
}

function handleSendCredentialsButton(event) {
  const passwordId = $(event.target).data('id');

  getPassword(token, state.state.organizationSelected.id, passwordId)
    .then(passwordResult => {
      console.log('password', passwordResult);
      const {attributes: {username, password}} = passwordResult;
      sendCredentials(username, password);
    })
    .catch(err => {
      console.log('error loading password', err);
    });
}
