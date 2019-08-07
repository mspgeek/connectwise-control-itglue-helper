import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import IconChevronLeft from '@material-ui/icons/ChevronLeft';
import IconChevronRight from '@material-ui/icons/ChevronRight';
import IconMenu from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

import {logout, resetAll} from '../redux/auth';
import {setActiveComponent} from '../redux/search';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  componentRoot: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
}));

function AppBarHeader(props) {
  const classes = useStyles();
  const {loggedIn, activeComponent, selectedOrganization} = props;

  React.useEffect(() => {

  }, [loggedIn]);

  /**
   *
   * @param componentName left is false, right is true
   */
  function handleChangeComponent(componentName) {
    props.setActiveComponent(componentName);
  }

  const components = {
    utils: <div key={0}>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => handleChangeComponent('header')}
      >
        <IconChevronRight/>
      </IconButton>
      {loggedIn && <Button color="inherit" onClick={() => props.logout()}>Logout</Button>}
      <Button color="secondary" onClick={() => props.resetAll()}>Reset State</Button>
    </div>,
    header: <div key={1} className={classes.componentRoot}>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => handleChangeComponent('utils')}
      >
        <IconChevronLeft/>
      </IconButton>
      <Typography variant="h6">
        ITGlue Helper
      </Typography>
    </div>,
    detail: <div key={2} className={classes.componentRoot}>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => handleChangeComponent(false)}
      >
        <IconChevronLeft/>
      </IconButton>
      <Typography variant="h6">
        {selectedOrganization && selectedOrganization.attributes && selectedOrganization.attributes.name ||
        'not selected'}
      </Typography>
    </div>,
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar disableGutters>
          {components[activeComponent]}
        </Toolbar>
      </AppBar>
    </div>
  );
}

AppBarHeader.propTypes = {
  //actions
  logout: PropTypes.func,
  resetAll: PropTypes.func,
  setActiveComponent: PropTypes.func,

  loginPending: PropTypes.bool,
  loggedIn: PropTypes.bool,
  searchContext: PropTypes.string,
  selectedOrganization: PropTypes.object,
  activeComponent: PropTypes.string,
};

AppBarHeader.defaultProps = {
  searchContext: 'global',
  activeComponent: 'header',
};

export default connect(
  state => ({
    ...state.auth,
    searchContext: state.search.searchContext,
    selectedType: state.search.selectedType,
    selectedOrganization: state.search.selectedOrganization,
    activeComponent: state.search.activeComponent,
  }),
  {logout, resetAll, setActiveComponent})(AppBarHeader);
