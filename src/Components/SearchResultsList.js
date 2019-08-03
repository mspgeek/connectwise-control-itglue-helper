import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconHome from '@material-ui/icons/Home';
import IconKey from '@material-ui/icons/VpnKey';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import {hideSearchResult, selectItem} from '../redux/search';
import {selectOrganization} from '../redux/organizations';
import {loadOrganizationPasswords, loadPasswordById, selectPasswordId} from '../redux/passwords';
import {showAlert} from '../redux/alert';

const useStyles = makeStyles(theme => ({
  loading: {
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  resultItem: {
    display: 'flex',
    padding: theme.spacing(0.5, 0.5),
    '& div': {
      minWidth: 0,
    },
  },
  resultItemLabel: {
    flexGrow: 1,
  },
  resultList: {
    padding: theme.spacing(0, 1),
  },
}));

function ResultItem(props) {
  const {classes, item, handleClick} = props;
  return (
    <MenuItem className={classes.resultItem} dense disableGutters onClick={() => handleClick(item)}>
      <Typography className={classes.resultItemLabel} noWrap>{item.name}</Typography>
      <ListItemIcon>
        {item.class === 'organization' ? <IconHome/> : <IconKey/>}
      </ListItemIcon>
    </MenuItem>
  );
}

ResultItem.propTypes = {
  item: PropTypes.object,
  classes: PropTypes.object,
  handleClick: PropTypes.func,
};

function SearchResultsList(props) {
  const {searchResults, searchLoading, searchLoaded} = props;
  const classes = useStyles();

  function handleClick(item) {
    console.log('selected item', item);
    // call action
    if (item.class === 'organization') {
      props.selectOrganization(item);
    } else if (item.class === 'password') {
      props.selectPasswordId(item.id);
      props.loadPasswordById(item);
    } else {
      // this shouldn't happen
      props.showAlert('Invalid result selected.');
    }
    props.hideSearchResult();
    props.selectItem(item);
  }

  return (
    <Paper square>
      <MenuList
        className={classes.resultList}
      >
        {searchLoading &&
        <MenuItem className={classes.loading} disabled>
          <Typography>Search Loading...</Typography>
        </MenuItem>}
        {searchLoaded && searchResults.length > 0 && searchResults.map((item, idx) => {
          const label = `${item.label}-${idx}`;
          return (
            <ResultItem
              item={item}
              key={label}
              classes={classes}
              handleClick={handleClick}
            />
          );
        })}
        {searchLoaded && searchResults.length === 0 &&
        <MenuItem className={classes.loading} disabled>
          <Typography>No results</Typography>
        </MenuItem>}
      </MenuList>
    </Paper>
  );
}

SearchResultsList.propTypes = {
  searchResults: PropTypes.array,
  searchLoading: PropTypes.bool,
  searchLoaded: PropTypes.bool,


  // actions
  showAlert: PropTypes.func,
  selectItem: PropTypes.func,
  hideSearchResult: PropTypes.func,
  selectOrganization: PropTypes.func,
  loadOrganizationPasswords: PropTypes.func,
  selectPasswordId: PropTypes.func,
  loadPasswordById: PropTypes.func,
};

export default connect(
  state => ({...state.search}),
  {
    selectItem,
    hideSearchResult,
    selectOrganization,
    selectPasswordId,
    loadOrganizationPasswords,
    loadPasswordById,
    showAlert,
  })(SearchResultsList);