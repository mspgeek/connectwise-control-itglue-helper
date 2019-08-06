/**
 * Created by kgrube on 8/2/2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import DetailPassword from './DetailPassword';
import OrganizationPasswords from './OrganizationPasswords';

// show password detail, or list of client passwords
function SearchResultDetail(props) {
  const {selectedItem, selectedType} = props;
  return (
    <>
      {selectedType === 'password' &&
      <DetailPassword
        password={selectedItem}
      />
      }
      {selectedType === 'organization' &&
      <OrganizationPasswords/>
      }
    </>
  );
}

SearchResultDetail.propTypes = {
  // state variables
  selectedItem: PropTypes.object,
  selectedType: PropTypes.string,
};

export default connect(state => ({
  selectedItem: state.search.selectedItem,
  selectedType: state.search.selectedType,
}), null)(SearchResultDetail);
