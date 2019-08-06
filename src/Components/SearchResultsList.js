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
import {hideSearchResult, selectItem, showSearchResult} from '../redux/search';
import {selectOrganization, loadOrganizationPasswords} from '../redux/organizations';
import {loadPasswordById, selectPasswordId} from '../redux/passwords';
import {showAlert} from '../redux/alert';
import LinearProgress from '@material-ui/core/LinearProgress';

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
    [theme.breakpoints.only('xs')]: {
      'overflowY': 'scroll',
      height: 500,
    },
    [theme.breakpoints.only('sm')]: {
      'overflowY': 'scroll',
      height: 300,
    },
    padding: theme.spacing(0, 1),
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
}));

function ResultItem(props) {
  const {classes, item, handleClick} = props;
  return (
    <MenuItem className={classes.resultItem} dense disableGutters onClick={() => handleClick(item)}>
      <Typography className={classes.resultItemLabel} noWrap>{
        item.class === 'organization' ? 
          `${item.name}` : `${item.name} (${item.organization_name})` 
      }</Typography>
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
      props.loadOrganizationPasswords(item);
    } else if (item.class === 'password') {
      props.selectPasswordId(item.id);
      props.loadPasswordById(item.id);
    } else {
      // this shouldn't happen
      props.showAlert('Invalid result selected.');
    }
    props.hideSearchResult();
    props.selectItem(item);
  }

  if (!props.searchResultOpen) {
    return null;
  }

  return (
    <Paper square>
      {searchLoading &&
      <div className={classes.progressRoot}>
        <LinearProgress className={classes.progress}/>
      </div>
      }
      {!searchLoading && searchLoaded &&
      <MenuList
        className={classes.resultList}
      >
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
      }
    </Paper>
  );
}

SearchResultsList.propTypes = {
  searchResultOpen: PropTypes.bool.isRequired,
  searchResults: PropTypes.array.isRequired,
  searchLoading: PropTypes.bool.isRequired,
  searchLoaded: PropTypes.bool.isRequired,

  // actions
  showAlert: PropTypes.func,
  selectItem: PropTypes.func,
  hideSearchResult: PropTypes.func,
  selectOrganization: PropTypes.func,
  loadOrganizationPasswords: PropTypes.func,
  selectPasswordId: PropTypes.func,
  loadPasswordById: PropTypes.func,
};

SearchResultsList.defaultProps = {
  showSearchResult: false,
  searchResults: [],
};

export default connect(
  // state => ({...state.search})
  null,
  {
    selectItem,
    hideSearchResult,
    selectOrganization,
    selectPasswordId,
    loadOrganizationPasswords,
    loadPasswordById,
    showAlert,
  })(SearchResultsList);
