import React from 'react';
import PropTypes from 'prop-types';

function TaskButton({ className, onClick, faIcon }) {
  return (
    <button
      type='button'
      className={className}
      onClick={onClick}
    >
      <i className={faIcon} />
    </button>
  );
}

TaskButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  faIcon: PropTypes.string.isRequired,
};

export default TaskButton;
