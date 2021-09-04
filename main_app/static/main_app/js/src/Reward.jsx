// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is used for reward item prompts
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import Modal from './components/Modal';
import { equipAvatar, purchaseAvatar } from './functions';

// Renders a prompt when a reward item (e.g. potion) is clicked:
function RewardPrompt() {
  const [promptItem, setPromptItem] = React.useState({});
  // Only runs on mount:
  React.useEffect(() => {
    // Adds an event listener for all reward items:
    const rewardItems = document.querySelectorAll('.reward-item');
    rewardItems.forEach((item) => {
      item.onclick = () => {
        const price = item.children[1].children[1].innerHTML;
        setPromptItem({
          name: item.children[1].children[0].innerHTML,
          imgSrc: item.children[0].src,
          price,
          id: item.id,
        });
        halfmoon.toggleModal('reward-prompt');
      };
    });
  }, []);
  // The content of the prompt:
  let content;
  // Button for submitting the prompt:
  let submitButton;
  // Buttons for both submitting and dismissing:
  let buttons;
  // The content changes based on whether the item is owned/equiped
  if (promptItem.price === 'Owned') {
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>
          Equip
          {promptItem.name}
          ?
        </div>
      </div>
    );
    submitButton = (
      <button
        type='button'
        className='btn btn-secondary'
        onClick={() => equipAvatar(promptItem.id)}
      >
        Yes
      </button>
    );
  } else if (promptItem.price === 'Equipped') {
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>
          {promptItem.name}
          {' '}
          is already equipped.
        </div>
      </div>
    );
    buttons = (
      <div className='text-right'>
        <button
          type='button'
          className='btn bg-gray'
          data-dismiss='modal'
        >
          Close
        </button>
      </div>
    );
  } else {
    submitButton = (
      <button
        type='button'
        className='btn btn-secondary'
        onClick={() => purchaseAvatar(promptItem.id)}
      >
        Yes
      </button>
    );
    const price = (
      <span dangerouslySetInnerHTML={{ __html: promptItem.price }} />
    );
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>
          Purchase
          {promptItem.name}
          {' '}
          for
          {price}
          {' '}
          ?
        </div>
      </div>
    );
  }
  // if the button is not yet set:
  if (!buttons) {
    // for equiping/purchasing
    buttons = (
      <div className='text-right'>
        <button
          type='button'
          className='btn bg-gray mr-5'
          data-dismiss='modal'
        >
          No
        </button>
        {submitButton}
      </div>
    );
  }
  // Returns a modal
  return (
    <Modal
      modalId='reward-prompt'
      title='Reward'
      content={content}
      buttons={buttons}
    />
  );
}

export default RewardPrompt;
