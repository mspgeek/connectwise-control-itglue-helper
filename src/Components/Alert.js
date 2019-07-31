import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {connect} from 'react-redux';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.error.light,
  },
}));

function Alert(props) {
  const classes = useStyles();
  const {message, show} = props;

  return (
    <div>
      {show ?
        <Paper className={classes.paper}>
          <Typography variant="body1">
            {message}
          </Typography>
        </Paper> : ''}
    </div>
  );
}

Alert.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
};

Alert.defaultProps = {
  message: '',
  show: false,
};

export default connect(state => ({...state.alert}))(Alert);
