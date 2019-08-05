import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import IconChevronLeft from '@material-ui/icons/ChevronLeft';
import IconChevronRight from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

import {logout, resetAll} from '../redux/auth';
import SearchSelect from './SearchSelect';


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
  searchSelect: {
    flexGrow: 1,
    padding: theme.spacing(0, 2),
    boxShadow: 'none',
  },
}));


function AppBarHeader(props) {
  const classes = useStyles();
  const {loggedIn} = props;

  const [activeComponent, setActiveComponent] = React.useState(1);

  /**
   *
   * @param direction left is false, right is true
   */
  function handleChangeComponent(direction) {
    setActiveComponent(direction ? activeComponent + 1 : activeComponent - 1);
  }

  const components = [
    <div key={0}>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => handleChangeComponent(true)}
      >
        <IconChevronRight/>
      </IconButton>
      {loggedIn && <Button color="inherit" onClick={() => props.logout()}>Logout</Button>}
      <Button color="secondary" onClick={() => props.resetAll()}>Reset State</Button>
    </div>,
    <div key={1} className={classes.componentRoot}>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={() => handleChangeComponent(false)}
      >
        <IconChevronLeft/>
      </IconButton>
      {loggedIn && <SearchSelect className={classes.searchSelect}/>}
    </div>,
  ];

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

  loginPending: PropTypes.bool,
  loggedIn: PropTypes.bool,
};
AppBarHeader.defaultProps = {};

export default connect(state => ({...state.auth}), {logout, resetAll})(AppBarHeader);
