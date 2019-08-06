import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {makeStyles, fade} from '@material-ui/core/styles';
import IconSearch from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import {filterPasswords, loadOrganizationPasswords, setPasswordSearchText} from '../redux/organizations';
import SearchResultsList from './SearchResultsList';

const useStyles = makeStyles(theme => ({
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
  inputInput: {
    padding: theme.spacing(1, 1, 1, 4),
    width: '100%',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    height: '100%',
  },
}));

function OrganizationPasswords(props) {
  const classes = useStyles();
  const {passwordSearchText, filteredPasswords, organizationPasswords} = props;
  const [searchText, setSearchText] = React.useState(passwordSearchText);
  const [searchTimeout, setSearchTimeout] = React.useState([]);

  React.useEffect(() => {
    console.log('use effect fired');
    props.filterPasswords(passwordSearchText);
  }, [organizationPasswords]);

  function handleChange(event) {
    // check if they're still typing, delete the last request if so
    if (searchTimeout.length > 0) {
      searchTimeout.forEach(id => clearTimeout(id));
    }

    const newSearchText = event.target.value;
    setSearchText(newSearchText);

    setSearchTimeout([...searchTimeout, setTimeout(() => {
      props.setPasswordSearchText(newSearchText);
      props.filterPasswords(newSearchText);
      setSearchTimeout([]);
    }, 200)]);
  }

  return (
    <>
      <Paper square className={classes.paperRoot}>
        <div className={classes.searchRoot}>
          <div className={classes.searchIcon}>
            <IconSearch/>
          </div>
          <InputBase
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            autoFocus
            inputProps={{'aria-label': 'search'}}
            onChange={handleChange}
            value={searchText}
            placeholder="Search"
          />
        </div>
      </Paper>
      <SearchResultsList
        searchResultOpen={true}
        searchResults={filteredPasswords}
        searchLoading={props.passwordsLoading}
        searchLoaded={props.passwordsLoaded}
      />
    </>
  );
}

OrganizationPasswords.propTypes = {
  // actions
  setPasswordSearchText: PropTypes.func,
  filterPasswords: PropTypes.func,
  loadOrganizationPasswords: PropTypes.func,

  // values
  organizationPasswords: PropTypes.array,
  filteredPasswords: PropTypes.array,
  passwordSearchText: PropTypes.string,

  // states
  passwordsLoading: PropTypes.bool,
  passwordsLoaded: PropTypes.bool,
};

OrganizationPasswords.defaultProps = {
  organizationPasswords: [],
  passwordSearchText: '',
};

export default connect(
  state => ({...state.organizations}),
  {setPasswordSearchText, filterPasswords, loadOrganizationPasswords})(OrganizationPasswords);
