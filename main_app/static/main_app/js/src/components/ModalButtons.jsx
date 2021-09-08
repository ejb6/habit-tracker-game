import React from 'react';
import PropTypes from 'prop-types';

function IconButton({ classAdd, faIcon, onClick }) {
  return (
    <button
      className={`btn ${classAdd}`}
      data-dismiss='modal'
      type='button'
      onClick={onClick}
    >
      <i className={faIcon} />
    </button>
  );
}

IconButton.propTypes = {
  classAdd: PropTypes.string,
  faIcon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
IconButton.defaultProps = {
  classAdd: '',
  onClick: () => {},
};

function SubmitButton({ formId }) {
  return (
    <button
      className='btn btn-secondary'
      data-dismiss='modal'
      type='submit'
      form={formId}
    >
      Save
    </button>
  );
}

SubmitButton.propTypes = {
  formId: PropTypes.string.isRequired,
};

export { IconButton, SubmitButton };
