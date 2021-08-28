import React from 'react';

// Used for creating modals
// Content can be a React App
export default function Modal({modalId, title, content, buttons}) {
  return (
    <div className='modal' id={ modalId } tabIndex='-1' role='dialog'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content p-20'>
          <h5 className='modal-title'>{ title }</h5>
          { content }
          { buttons }
        </div>
      </div>
    </div>
  )
}
