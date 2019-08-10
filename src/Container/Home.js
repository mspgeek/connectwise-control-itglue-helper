import {hot} from 'react-hot-loader/root';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {connect} from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Login from '../Components/Login';
import Alert from '../Components/Alert';

import {checkToken} from '../redux/auth';
import AppBarHeader from '../Components/AppBarHeader';
import SearchResultsList from '../Components/SearchResultsList';
import SearchResultDetail from '../Components/SearchResultDetail';
import SearchSelect from '../Components/SearchSelect';

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

const useStyles = makeStyles((currentTheme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  containerRoot: {
    padding: currentTheme.spacing(0, 1),
    [theme.breakpoints.only('xs')]: {
      'overflowY': 'scroll',
      height: 500,
    },
    [theme.breakpoints.only('sm')]: {
      'overflowY': 'scroll',
      height: 300,
    },
  },
}));

function Home(props) {
  const {
    loggedIn,
    token,
    loginPending,
    user: {subdomain},
    selectedPassword,
    searchResultOpen,
    searchLoaded,
    searchLoading,
    searchResults,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    // // if there's a saved token, check if it's valid
    // // @TODO need to check token is valid more often
    props.checkToken();

    console.log('token changed', token);
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppBarHeader/>
      <Container maxWidth="xl" className={classes.containerRoot}>
        <Alert/>
        {!loggedIn && !loginPending &&
        <Login/>}
        {loggedIn && !selectedPassword &&
        <>
          <SearchSelect/>
          <SearchResultsList
            searchResultOpen={searchResultOpen}
            searchResults={searchResults}
            searchLoading={searchLoading}
            searchLoaded={searchLoaded}
          />
        </>}
        {loggedIn && selectedPassword &&
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
  searchResultOpen: PropTypes.bool,
  searchLoading: PropTypes.bool,
  searchLoaded: PropTypes.bool,

  // values
  searchResults: PropTypes.array,
  user: PropTypes.object,
  token: PropTypes.string,
  selectedPassword: PropTypes.object,
};

Home.defaultProps = {
  loggedIn: false,
  loginPending: false,
  token: undefined,
  searchResultOpen: false,
  selectedOrganization: undefined,
};

export default connect(state => ({
  ...state.auth,
  selectedPassword: state.search.selectedPassword,
  searchResultOpen: state.search.searchResultOpen,
  searchResults: state.search.searchResults,
  searchLoading: state.search.searchLoading,
  searchLoaded: state.search.searchLoaded,
}), {checkToken})(hot(Home));
