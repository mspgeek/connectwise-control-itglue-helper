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
import {handleNavigation, setActiveComponent} from '../redux/search';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    // paddingBottom: theme.spacing(1),
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
  header: {
    alignItems: 'center',
  },
}));

function HeaderComponent(props) {
  const {direction, onNavigation} = props;

  const classes = useStyles();

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => onNavigation(direction)}
      >
        {direction === 'left' ? <IconChevronLeft/> : <IconChevronRight/>}
      </IconButton>
      {props.children}
    </>
  );
}

HeaderComponent.propTypes = {
  children: PropTypes.element,
  direction: PropTypes.string,
  onNavigation: PropTypes.func,
};

HeaderComponent.defaultProps = {
  direction: 'left',
};

function AppBarHeader(props) {
  const classes = useStyles();
  const {activeComponent, selectedOrganization, password} = props;

  const title = (selectedOrganization && selectedOrganization.name)
    || (password && password.attributes && password.attributes['organization-name'])
    || 'IT Glue Helper';

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar disableGutters>
        {activeComponent === 'utils' &&
        <HeaderComponent onNavigation={props.handleNavigation} direction="right">
          {props.loggedIn && <Button color="inherit" onClick={() => props.logout()}>Logout</Button>}
          <Button color="secondary" onClick={() => props.resetAll()}>Reset State</Button>
        </HeaderComponent>
        }
        {activeComponent !== 'utils' &&
        <HeaderComponent onNavigation={props.handleNavigation}>
          <Typography variant="h6" className={classes.header}>
            {title}
          </Typography>
        </HeaderComponent>
        }
      </Toolbar>
    </AppBar>
  );
}

AppBarHeader.propTypes = {
  //actions
  logout: PropTypes.func,
  resetAll: PropTypes.func,
  setActiveComponent: PropTypes.func,
  handleNavigation: PropTypes.func,

  loginPending: PropTypes.bool,
  loggedIn: PropTypes.bool,
  searchContext: PropTypes.string,
  selectedOrganization: PropTypes.object,
  activeComponent: PropTypes.string,
  password: PropTypes.object,
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
    password: state.passwords.password,
  }),
  {logout, resetAll, setActiveComponent, handleNavigation})(AppBarHeader);
