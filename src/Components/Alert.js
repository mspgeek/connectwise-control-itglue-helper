import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {connect} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import IconDismiss from '@material-ui/icons/Close';

import {dismissAlert} from '../redux/alert';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.error.light,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typography: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
  },
}));

function Alert(props) {
  const classes = useStyles();
  const {message, show} = props;

  let messageClean = message;
  if (typeof message === 'object') {
    if (message.message) {
      messageClean = message.message;
    } else if (message.title) {
      messageClean = message.title;
      if (message.detail) {
        messageClean = `${messageClean} - ${message.detail}`;
      }
    } else {
      messageClean = JSON.stringify(message);
    }
  }

  return (
    <div>
      {show &&
      <Paper className={classes.paper}>
        <Typography variant="body1" className={classes.typography}>
          {messageClean}
        </Typography>
        <IconButton onClick={props.dismissAlert}>
          <IconDismiss/>
        </IconButton>
      </Paper>}
    </div>
  );
}

Alert.propTypes = {
  // actions
  dismissAlert: PropTypes.func,

  message: PropTypes.string,
  show: PropTypes.bool,
};

Alert.defaultProps = {
  message: '',
  show: false,
};

export default connect(state => ({...state.alert}), {dismissAlert})(Alert);
