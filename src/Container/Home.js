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

import {checkToken} from '../redux/auth';
import AppBarHeader from '../Components/AppBarHeader';
import ResultsDisplay from '../Components/SearchResultsList';
import SearchResultDetail from '../Components/SearchResultDetail';

const theme = createMuiTheme({
  breakpoints: {
    xs: 0,
    sm: 250,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  typography: {
    fontSize: 13,
  },
});


function Home(props) {
  const {loggedIn, token, loginPending, user: {subdomain}, selectedItem, showSearchResult} = props;

  useEffect(() => {
    // if there's a saved token, check if it's valid
    // @TODO need to check token is valid more often
    if (!loggedIn && !loginPending && subdomain && token) {
      props.checkToken();
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="xl">
        <AppBarHeader/>
        <Alert/>
        {!loggedIn &&
        <Login/>}
        {loggedIn && showSearchResult &&
        <ResultsDisplay/>}
        {loggedIn && selectedItem &&
        <SearchResultDetail/>}
      </Container>
    </ThemeProvider>
  );
}

Home.propTypes = {
  // actions
  checkToken: PropTypes.func,

  // state
  loggedIn: PropTypes.bool,
  loginPending: PropTypes.bool,
  showSearchResult: PropTypes.bool,

  user: PropTypes.object,
  token: PropTypes.string,
  selectedItem: PropTypes.object,
};

Home.defaultProps = {
  loggedIn: false,
  loginPending: false,
  token: undefined,
  showSearchResult: false,
  selectedOrganization: undefined,
};

export default connect(state => ({
  ...state.auth,
  selectedItem: state.search.selectedItem,
  showSearchResult: state.search.showSearchResult,
}), {checkToken})(hot(Home));
