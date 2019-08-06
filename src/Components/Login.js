import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';

import {setAuth, login} from '../redux/auth';
import {connect} from 'react-redux';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

  const {email, subdomain, otp, password, loginPending} = props;

  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={12}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="subdomain"
              label="Subdomain"
              name="subdomain"
              autoComplete="subdomain"
              autoFocus
              onChange={handleChange('subdomain')}
              value={subdomain}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
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
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
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
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
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
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loginPending}
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

Login.propTypes = {
  // actions
  setAuth: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,

  // values
  subdomain: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  otp: PropTypes.string,

  // state
  loginPending: PropTypes.bool,

};

Login.defaultProps = {
  subdomain: '',
  email: '',
  password: '',
  otp: '',
  loginPending: false,
};

export default connect(
  state => ({...state.auth.user, loginPending: state.auth.loginPending}),
  {setAuth, login})(Login);
