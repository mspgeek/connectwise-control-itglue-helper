/**
 * Created by kgrube on 8/2/2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/styles';

import DetailPassword from './DetailPassword';
import PasswordsList from './PasswordsList';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

// show password detail, or list of client passwords
function SearchResultDetail(props) {
  const {selectedItem, selectedType} = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      {selectedType === 'password' &&
      <DetailPassword
        password={selectedItem}
      />
      }
      {selectedType === 'organization' &&
      <PasswordsList/>
      }
    </Paper>
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
