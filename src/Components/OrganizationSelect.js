import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {emphasize, makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import {connect} from 'react-redux';

import {loadOrganizations, loadOrganizationSearch, selectOrganization} from '../redux/organizations';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290,
    paddingTop: theme.spacing(2),
  },
  input: {
    display: 'flex',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props to be passed on to the wrapper.
   */
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({inputRef, ...props}) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: {classes, TextFieldProps},
  } = props;

  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  /**
   * Children to render.
   */
  children: PropTypes.node,
  /**
   * The mouse down event and the innerRef to pass down to the controller element.
   */
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired,
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * Inner ref to DOM Node
   */
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  /**
   * Whether the option is focused.
   */
  isFocused: PropTypes.bool.isRequired,
  /**
   * Whether the option is selected.
   */
  isSelected: PropTypes.bool.isRequired,
};

function Placeholder(props) {
  const {selectProps, innerProps = {}, children} = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

Placeholder.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.any.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.element.isRequired,
  /**
   * Props to be passed to the menu wrapper.
   */
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  SingleValue,
  ValueContainer,
};

function OrganizationSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {organizationsLoading, organizationsLoadingError, organizationsLoaded} = props;
  const [searchTimeout, setSearchTimeout] = React.useState(undefined);
  const [searchCallback, setSearchCallback] = React.useState(undefined);

  function handleChangeSingle(value) {
    props.selectOrganization(value);
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  React.useEffect(() => {
    if (props.searchLoaded && !props.searchLoading && searchCallback) {
      searchCallback(props.searchResults);
    }
  });

  const promiseOptions = (inputValue, callback) => {
    // set a timeout delay before firing to let the user finish typing
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchCallback(() => callback);

    console.log('waiting...');
    setSearchTimeout(setTimeout(() => {
      console.log('done waiting');
      props.loadOrganizationSearch(inputValue);
    }, 400));
  };

  return (
    <div className={classes.root}>
      <AsyncSelect
        classes={classes}
        styles={selectStyles}
        inputId="organization-select"
        TextFieldProps={{
          label: 'Organization',
          InputLabelProps: {
            htmlFor: 'organization-select',
            shrink: true,
          },
        }}
        loadOptions={promiseOptions}
        components={components}
        // value={props.selectedOrganization}
        onChange={handleChangeSingle}
      />
    </div>
  );
}

OrganizationSelect.propTypes = {
  // actions
  loadOrganizations: PropTypes.func,
  selectOrganization: PropTypes.func,
  loadOrganizationSearch: PropTypes.func,

  // state
  organizationsLoading: PropTypes.bool,
  organizationsLoadingError: PropTypes.object,
  organizationsLoaded: PropTypes.bool,
  selectedOrganization: PropTypes.object,

  // search state
  searchResults: PropTypes.array,
  searchLoading: PropTypes.bool,
  searchLoaded: PropTypes.bool,

  // values
  organizations: PropTypes.array,
};

OrganizationSelect.defaultProps = {
  organizationsLoading: false,
  organizationsLoaded: false,
  organizations: [],
  selectedOrganization: undefined,
};

export default connect(
  state => ({...state.organizations}),
  {loadOrganizations, selectOrganization, loadOrganizationSearch})(OrganizationSelect);
