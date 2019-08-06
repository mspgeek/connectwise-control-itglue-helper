import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import copy from 'clipboard-copy';
import {makeStyles} from '@material-ui/styles';
import IconCopy from '@material-ui/icons/FileCopy';
import IconAccountBox from '@material-ui/icons/AccountBox';
import IconAssignmentReturn from '@material-ui/icons/AssignmentReturn';
import IconKey from '@material-ui/icons/VpnKey';
import IconButton from '@material-ui/core/IconButton';
import IconOpenInNew from '@material-ui/icons/OpenInNew';
import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

import {getPasswordById, sendCredentials, sendText} from '../helpers';
import DetailTextField from './DetailTextField';
import CopyNotification from './CopyNotification';

/**
 * Created by kgrube on 8/2/2019
 */

const useStyles = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(1),
    },
    gridItem: {
      display: 'flex',
      flexDirection: 'row',
    },
    actions: {
      flewGrow: 1,
    },
    progressRoot: {
      display: 'flex',
      justifyContent: 'center',
      height: theme.spacing(8),
      alignItems: 'center',
    },
    progress: {
      flexGrow: 1,
    },
  };
});

function DetailPassword(props) {
  const {password, passwordLoaded, passwordLoading} = props;
  const classes = useStyles();
  const [copyNotificationOpen, setCopyNotificationOpen] = React.useState(false);
  const [copyMessage, setCopyMessage] = React.useState('Copied to clipboard');

  function handleCloseCopyNotification() {
    setCopyNotificationOpen(false);
  }

  /**
   *
   * @param value specify value to copy, and value to pass to callback
   * @param message specify popup message
   * @param copyText specify
   * @param loadPassword should we try to load the password field?
   * @param callback callback(value)
   * @returns {Function}
   */
  function wrapButtonClick({value, message, copyText = false, loadPassword = false, callback}) {
    return () => {
      return Promise.resolve()
        .then(() => {
          if (loadPassword) {
            const {token} = props;
            return getPasswordById({token, passwordId: password.id, showPassword: true})
              .then(result => result.attributes.password);
          }
          return value;
        })
        .then(result => {
          if (copyText) {
            return copy(result);
          }
          return result;
        })
        .then(result => {
          if (callback) {
            // eslint-disable-next-line promise/no-callback-in-promise
            callback(result);
          }

          setCopyNotificationOpen(true);
          setCopyMessage(message);
        })
        .catch(error => {
          // @TODO catch these errors somehow
        });
    };
  }

  return (
    <div className={classes.root}>
      <CopyNotification message={copyMessage} open={copyNotificationOpen} onClose={handleCloseCopyNotification}/>
      {passwordLoading && !passwordLoaded &&
      <div className={classes.progressRoot}>
        <LinearProgress className={classes.progress}/>
      </div>
      }
      {passwordLoaded && !passwordLoading &&
      <>
        <Typography variant="h6">{password.attributes.name}</Typography>
        <Grid container spacing={1} style={{paddingTop: 8}}>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <div>
              <Tooltip title="Send Credentials" className={classes.actions} color="primary">
                <IconButton
                  size="medium"
                  onClick={wrapButtonClick({
                    loadPassword: true,
                    message: 'Credentials sent',
                    callback: (value) => sendCredentials(password.attributes.username, value),
                  })}
                >
                  <IconAssignmentReturn/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Send Username" className={classes.actions}>
                <IconButton
                  size="medium"
                  onClick={wrapButtonClick({
                    value: password.attributes.username,
                    message: 'Username sent',
                    callback: (value) => sendText(value),
                  })}
                >
                  <IconAccountBox/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Send Password" className={classes.actions}>
                <IconButton
                  size="medium"
                  onClick={wrapButtonClick({
                    message: 'Password sent',
                    loadPassword: true,
                    callback: (value) => sendText(value),
                  })}
                >
                  <IconKey/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in IT Glue" color="secondary">
                <IconButton
                  size="medium"
                  onClick={() => window.open(password.attributes['resource-url'])}
                >
                  <IconOpenInNew/>
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailTextField
              label="Username"
              value={password.attributes.username}
              wrapButtonClick={wrapButtonClick}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailTextField
              label="Password"
              type="password"
              wrapButtonClick={wrapButtonClick}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailTextField
              label="Notes"
              value={password.attributes.notes}
              multiline
              showCopy={false}
            />
          </Grid>
        </Grid>
      </>
      }
    </div>
  );
}

DetailPassword.propTypes = {
  password: PropTypes.object,
  token: PropTypes.string,

  passwordLoaded: PropTypes.bool,
  passwordLoading: PropTypes.bool,
};

DetailPassword.defaultProps = {
  password: {
    attributes: {},
  },
};

export default connect(state => ({
  token: state.auth.token,
  password: state.passwords.password,
  passwordLoaded: state.passwords.passwordLoaded,
  passwordLoading: state.passwords.passwordLoading,
}), null)(DetailPassword);
