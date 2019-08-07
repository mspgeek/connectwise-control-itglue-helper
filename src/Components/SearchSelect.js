import React from 'react';
import PropTypes from 'prop-types';
import {fade, makeStyles} from '@material-ui/core/styles';
import IconSearch from '@material-ui/icons/Search';
import IconGlobe from '@material-ui/icons/Language';
import InputBase from '@material-ui/core/InputBase';

import {connect} from 'react-redux';

import {loadSearch, setSearchText, showSearchResult, toggleSearchContext} from '../redux/search';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.25),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '100%',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    height: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },

  paperRoot: {
    padding: theme.spacing(1),
  },
  searchRoot: {
    position: 'relative',
    backgroundColor: fade(theme.palette.common.white, 0.25),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(4),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'center',
    justifyContent: 'center',
    border: theme.border,
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
      props.loadSearch(searchText);
      setSearchTimeout([]);
    }, 150)]);
  }

  // function startNewSearch() {
  //   props.showSearchResult();
  //   // props.deselectItem();
  //   props.loadSearch(props.searchText);
  // }
  //
  // function handleFocus(event) {
  //   props.showSearchResult();
  //   // props.deselectItem();
  //   if (!props.searchLoaded && props.searchText) {
  //     props.loadSearch(props.searchText);
  //   }
  // }

  function handleSearchTypeChange() {
    props.toggleSearchContext();
  }

  const classes = useStyles();

  return (
    <Paper square className={classes.paperRoot}>
      <div className={classes.searchRoot}>

        <IconButton onClick={handleSearchTypeChange} className={classes.searchIcon}>
          {props.searchContext === 'organization'
            ? <IconSearch/>
            : <IconGlobe/>
          }
        </IconButton>
        <InputBase
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{'aria-label': 'search'}}
          onChange={handleChange}
          value={props.searchText}
          placeholder="Search"
          // onFocus={handleFocus}
        />
      </div>
    </Paper>
  );
}

SearchSelect.propTypes = {
  // actions
  loadSearch: PropTypes.func,
  setSearchText: PropTypes.func,
  showSearchResult: PropTypes.func,
  toggleSearchContext: PropTypes.func,

  // state
  searchLoading: PropTypes.bool,
  searchLoaded: PropTypes.bool,

  // values
  searchResults: PropTypes.array,
  searchText: PropTypes.string,
  searchContext: PropTypes.oneOf(['global', 'organization']),
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
  {loadSearch, setSearchText, showSearchResult, toggleSearchContext})(SearchSelect);
