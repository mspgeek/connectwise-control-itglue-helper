import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import IconCopy from '@material-ui/icons/FileCopy';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InputBase from '@material-ui/core/InputBase';
import CopyNotification from './CopyNotification';
import Tooltip from '@material-ui/core/Tooltip';
import copy from 'clipboard-copy';

const useStyles = makeStyles(theme => ({
  formControl: {
    color: theme.palette.text.primary,
    flexGrow: 1,
  },
  formValue: {
    // position: 'relative',
  },
  label: {
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    height: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 0, 0, 0),
    width: '100%',
  },
}));

function DetailTextField(props) {
  const {value, label, type, showCopy, multiline, wrapButtonClick} = props;
  const classes = useStyles();
  const [copyNotificationOpen, setCopyNotificationOpen] = React.useState(false);

  function handleCloseCopyNotification() {
    setCopyNotificationOpen(false);
  }

  return (
    <div className={classes.textFieldRoot}>
      <FormControl className={classes.formControl}>
        <InputLabel className={classes.label}>{label}</InputLabel>
        <InputBase
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          multiline={multiline}
          inputProps={{'aria-label': 'search'}}
          value={type === 'password' ? '*******' : (value || '--')}
          label={label}
        />
      </FormControl>
      {showCopy &&
      <Tooltip title={`Copy ${label}`}>
        <IconButton
          onClick={type === 'password'
            ? wrapButtonClick({
              message: 'Copied to clipboard',
              loadPassword: true,
              copyText: true,
            })
            : wrapButtonClick({
              value: value,
              copyText: true,
              message: 'Copied to clipboard',
            })}
        >
          <IconCopy/>
        </IconButton>
      </Tooltip>}
    </div>
  );
}

DetailTextField.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  showCopy: PropTypes.bool,
  multiline: PropTypes.bool,

  wrapButtonClick: PropTypes.func,
};

DetailTextField.defaultProps = {
  multiline: false,
  showCopy: true,
  value: '',
};

export default DetailTextField;
