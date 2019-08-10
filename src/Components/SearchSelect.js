import React from 'react';
import PropTypes from 'prop-types';
import {fade, makeStyles} from '@material-ui/core/styles';
import IconSearch from '@material-ui/icons/Search';
import IconGlobe from '@material-ui/icons/Language';
import InputBase from '@material-ui/core/InputBase';

import {connect} from 'react-redux';

import {loadSearch, setSearchText, toggleSearchContext} from '../redux/search';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  paperRoot: {
    padding: theme.spacing(1),
    display: 'flex',
  },
  iconButton: {
    padding: 10,
  },
  inputBase: {
    marginLeft: 8,
    flex: 1,
  },
}));

function SearchSelect(props) {
  const [searchTimeout, setSearchTimeout] = React.useState([]);

  function handleChange(event) {
    // check if they're still typing, delete the last request if so
    if (searchTimeout.length > 0) {
      searchTimeout.forEach(id => clearTimeout(id));
    }

    const searchText = event.target.value;
    props.setSearchText(searchText);

    setSearchTimeout([...searchTimeout, setTimeout(() => {
      props.loadSearch();
      setSearchTimeout([]);
    }, 150)]);
  }

  function handleSearchContextChange() {
    props.toggleSearchContext();
  }

  const classes = useStyles();

  return (
    <Paper square className={classes.paperRoot}>
      <IconButton onClick={handleSearchContextChange} className={classes.iconButton}>
        {props.searchContext === 'organization'
          ? <IconSearch/>
          : <IconGlobe/>
        }
      </IconButton>
      <InputBase
        className={classes.inputBase}
        inputProps={{'aria-label': 'search'}}
        onChange={handleChange}
        value={props.searchText}
        placeholder={props.searchContext === 'organization'
          ? `Search ${props.selectedOrganization && props.selectedOrganization.name}`
          : 'Global search'}
      />
    </Paper>
  );
}

SearchSelect.propTypes = {
  // actions
  loadSearch: PropTypes.func,
  setSearchText: PropTypes.func,
  toggleSearchContext: PropTypes.func,

  // state
  searchLoading: PropTypes.bool,
  searchLoaded: PropTypes.bool,

  // values
  searchResults: PropTypes.array,
  searchText: PropTypes.string,
  searchContext: PropTypes.oneOf(['global', 'organization']),
  selectedOrganization: PropTypes.object,
};

SearchSelect.defaultProps = {
  searchLoading: false,
  searchLoaded: false,
  searchContext: 'global',

  searchText: '',
  searchResults: [],
};

export default connect(
  state => ({...state.search}),
  {loadSearch, setSearchText, toggleSearchContext})(SearchSelect);
