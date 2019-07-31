import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import {withTheme, makeStyles} from '@material-ui/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import {setAuth, login} from '../redux/auth';
import {connect} from 'react-redux';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const handleChange = name => event => props.setAuth(name, event.target.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    props.login();
  };

  const {email, server, otp, password} = props;

  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon/>
      </Avatar>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="server"
          label="Company URL"
          autoComplete="server"
          autoFocus
          onChange={handleChange('server')}
          value={server}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          onChange={handleChange('email')}
          value={email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={handleChange('password')}
          value={password}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="otp"
          label="MFA Code"
          type="password"
          id="otp"
          onChange={handleChange('otp')}
          value={otp}
        />
        {/*<FormControlLabel*/}
        {/*  control={<Checkbox value="remember" color="primary"/>}*/}
        {/*  label="Remember me"*/}
        {/*/>*/}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

Login.propTypes = {
  // actions
  setAuth: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,

  // values
  server: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  otp: PropTypes.string,
};

Login.defaultProps = {
  server: '',
  email: '',
  password: '',
  otp: '',
};

export default connect(state => ({...state.auth.user}), {setAuth, login})(Login);
