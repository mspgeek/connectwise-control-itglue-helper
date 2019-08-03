import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';

import EnhancedTable from './EnhancedTable';
import {loadOrganizationPasswords, loadPassword} from '../redux/passwords.js';


function PasswordsList(props) {
  const {passwords, passwordsLoaded, passwordsLoading, passwordsLoadError} = props;

  const buttonRender = (row) => <Button variant="outlined" onClick={() => handleButtonClick(row.passwordId, row.orgId)}>Send</Button>;

  // name, username, category
  const headRows = [
    {id: 'name', numeric: false, disablePadding: false, label: 'Name'},
    {id: 'username', numeric: false, disablePadding: false, label: 'Username'},
    {id: 'category', numeric: false, disablePadding: false, label: 'Category'},
    //@TODO disable sort on this row
    {id: 'action', numeric: false, disablePadding: true, label: 'Actions', render: buttonRender},
  ];


  function handleButtonClick(passwordId, orgId) {
    props.loadPassword(orgId, passwordId);
  }

  // React.useEffect(() => {
  //   if (!passwordsLoaded && !passwordsLoading && !passwordsLoadError) {
  //     props.loadOrganizationPasswords();
  //   }
  // });

  return (
    <div>
      {passwordsLoaded && !passwordsLoading && <EnhancedTable
        tableName="Passwords"
        headRows={headRows}
        rows={passwords}
      />}
    </div>
  );
}

PasswordsList.propTypes = {
  // actions
  loadOrganizationPasswords: PropTypes.func,
  loadPassword: PropTypes.func,

  passwords: PropTypes.array,
  passwordsLoaded: PropTypes.bool,
  passwordsLoading: PropTypes.bool,
  passwordsLoadError: PropTypes.any,
};

PasswordsList.defaultProps = {
  passwords: [],
  passwordsLoaded: false,
  passwordsLoading: false,
  passwordsLoadError: false,
};

export default connect(state => ({...state.passwords}), {loadOrganizationPasswords, loadPassword})(PasswordsList);
