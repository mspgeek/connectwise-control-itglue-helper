import {hot} from 'react-hot-loader/root';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {connect} from 'react-redux';

import Login from '../Components/Login';
import Alert from '../Components/Alert';
import OrganizationSelect from '../Components/OrganizationSelect';

import {checkToken} from '../redux/auth';
import PasswordsList from '../Components/PasswordsList';
import AppBarHeader from '../Components/AppBarHeader';

const theme = createMuiTheme();


function Home(props) {
  const {loggedIn, token, loginPending, selectedOrganization} = props;

  useEffect(() => {
    // if there's a saved token, check if it's valid
    if (!loggedIn && !loginPending && token) {
      props.checkToken();
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="lg">
        <AppBarHeader/>
        <Alert/>
        {!loggedIn &&
        <Login/>}
        {loggedIn && <div>
          <OrganizationSelect/>
          {selectedOrganization && <PasswordsList/>}
        </div>
        }
      </Container>
    </ThemeProvider>
  );
}

Home.propTypes = {
  // actions
  checkToken: PropTypes.func,

  loggedIn: PropTypes.bool,
  loginPending: PropTypes.bool,
  token: PropTypes.string,
  selectedOrganization: PropTypes.object,
};

Home.defaultProps = {
  loggedIn: false,
  loginPending: false,
  token: undefined,
  selectedOrganization: undefined,
};

export default connect(state => ({
  ...state.auth,
  selectedOrganization: state.organizations.selectedOrganization,
}), {checkToken})(hot(Home));
