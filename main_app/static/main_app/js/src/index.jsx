import React from 'react';
import ReactDOM from 'react-dom';
import StatusBars from './StatusBars';
import RewardPrompt from './Reward';
import ModalAlert from './ModalAlert';

// Render the status bars
ReactDOM.render(
  <StatusBars />,
  document.querySelector('#profile_stats'),
);
// Consequently, this will also render all the tasks and forms

// Render the prompt for purchasing a reward:
ReactDOM.render(
  <RewardPrompt />,
  document.querySelector('#hidden-reward-prompt'),
);

// Render the modal for alerts:
ReactDOM.render(
  <ModalAlert />,
  document.querySelector('#hidden-alert-modal'),
);
