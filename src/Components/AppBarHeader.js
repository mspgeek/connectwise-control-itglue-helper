import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import {logout} from '../redux/auth';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function AppBarHeader(props) {
  const classes = useStyles();

  const {loggedIn} = props;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
          {/*  <MenuIcon/>*/}
          {/*</IconButton>*/}
          <Typography variant="h6" className={classes.title}>
            ITGlue Helper
          </Typography>
          {loggedIn && <Button color="inherit" onClick={() => props.logout()}>Logout</Button>}
          {!loggedIn && <Typography variant="body2">Not Authenticated</Typography>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

AppBarHeader.propTypes = {
  //actions
  logout: PropTypes.func,

  loginPending: PropTypes.bool,
  loggedIn: PropTypes.bool,
};
AppBarHeader.defaultProps = {};

export default connect(state => ({...state.auth}), {logout})(AppBarHeader);
