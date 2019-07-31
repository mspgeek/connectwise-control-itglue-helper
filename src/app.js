import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import Home from './Container/Home';
import {Provider} from 'react-redux';

import {getSavedToken} from './helpers';
import create from './redux/create';

// load from localSettings
const store = create({
  auth: {
    token: getSavedToken(),
  },
  alert: {},
  organizations: {},
  passwords: {},
});


const App = () => <Provider store={store}><Home/></Provider>;

ReactDOM.render(<App/>, document.getElementById('app'));
