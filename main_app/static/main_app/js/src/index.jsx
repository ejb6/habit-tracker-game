import React from 'react';
import ReactDOM from 'react-dom';
import StatusBars from './StatusBars';
import RewardPrompt from './Reward';

// Render the status bars
ReactDOM.render(
  <StatusBars />,
  document.querySelector('#profile_stats'),
);
// Render the prompt for purchasing a reward:
ReactDOM.render(
  <RewardPrompt />,
  document.querySelector('#hidden-reward-prompt'),
);
