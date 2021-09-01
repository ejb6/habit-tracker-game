import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './components/Modal';

// Renders a prompt when a reward item (e.g. potion) is clicked:
function RewardPrompt() {
  const [promptItem, setPromptItem] = React.useState({});
  // Only runs on mount:
  React.useEffect(() => {
    // For purchasing rewards:
    const rewardItems = document.querySelectorAll('.reward-item');
    rewardItems.forEach((item) => {
      item.onclick = () => {
				const price = item.children[1].children[1].innerHTML;
        setPromptItem({
          'name': item.children[1].children[0].innerHTML,
          'imgSrc': item.children[0].src,
          'price': price,
          'id': item.id,
        });
        halfmoon.toggleModal('reward-prompt');
      }
    });
  }, []);

	function equipAvatar() {
		console.log('equip');
		console.log(promptItem.id);
	}
	function purchaseAvatar() {
		console.log('purchase');
		console.log(promptItem.id);
	}
  // The content of the prompt:
  let content;
	// Button for submitting the prompt:
	let submitButton;
	// Buttons for both submitting and dismissing:
	let buttons;
  // The content changes based on whether the item is owned/equiped/unowned:
  if (promptItem.price == 'Owned') {
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>Equip {promptItem.name}?</div>
      </div>
    );
		submitButton = (
      <button 
        type='button' 
        className='btn btn-secondary'
        data-dismiss='modal'
				onClick = {equipAvatar}
      >
        Yes
      </button>
		);
  } else if (promptItem.price == 'Equiped') {
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>{promptItem.name} is already equiped.</div>
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
        data-dismiss='modal'
				onClick = {purchaseAvatar}
      >
        Yes
      </button>
		);
    const price = (
      <span dangerouslySetInnerHTML={{__html: promptItem.price}}></span>
    );
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>Purchase {promptItem.name} for {price} ?</div>
      </div>
    );
  }

	// if the button is not yet set:
  if (!buttons) {
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
