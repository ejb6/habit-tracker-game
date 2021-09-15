import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from './ModalButtons';

// Used for creating modals
// Content can be a React App
export default function Modal({
  modalId, title, content, buttons,
}) {
  return (
    <div className='modal' id={modalId} tabIndex='-1' role='dialog'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content p-20'>
          <h5 className='modal-title'>{ title }</h5>
          { content }
          { buttons }
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  modalId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  buttons: PropTypes.node,
};

Modal.defaultProps = {
  buttons: (
    <div className='text-right mt-15'>
      <IconButton
        classAdd='btn-dark mr-5'
        dismiss='modal'
        faIcon='fas fa-times'
      />
    </div>
  ),
};
