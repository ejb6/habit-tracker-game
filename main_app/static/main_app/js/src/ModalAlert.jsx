import React from 'react';
import Modal from './components/Modal';

function ModalAlert() {
  return (
    <Modal
      modalId='alert-modal'
      title='Note'
      content={<ul id='alert-list' />}
    />
  );
}

export default ModalAlert;
