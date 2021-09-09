import React from 'react';
import PropTypes from 'prop-types';

function TaskBody({ title, subtext }) {
  return (
    <div className='py-5 overflow-hide task-title'>
      <div>
        {title}
      </div>
      <small className='text-teal'>
        {subtext}
      </small>
    </div>
  );
}

TaskBody.propTypes = {
  title: PropTypes.string.isRequired,
  subtext: PropTypes.node.isRequired,
};

export default TaskBody;
