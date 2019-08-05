import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import makeStyles from '@material-ui/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import IconClose from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

function CopyNotification(props) {
  const classes = useStyles();

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    props.onClose();
  }

  return (
    <Snackbar
      open={props.open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={5000}
      onClose={handleClose}
      message={<span id="message-id">{props.message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <IconClose/>
        </IconButton>,
      ]}
    />
  );
}

CopyNotification.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

CopyNotification.defaultProps = {
  message: 'Copied to clipboard',
};

export default CopyNotification;
