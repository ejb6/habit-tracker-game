import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './components/Modal';

function PurchasePrompt() {
  const [promptItem, setPromptItem] = React.useState({});
  // Only runs on mount:
  React.useEffect(() => {
    // For purchasing rewards:
    const rewardItems = document.querySelectorAll('.reward-item');
    rewardItems.forEach((item) => {
      item.onclick = () => {
        setPromptItem({
          'name': item.children[1].children[0].innerHTML,
          'imgSrc': item.children[0].src,
          'price': item.children[1].children[1].innerHTML,
          'id': item.id
        });
        halfmoon.toggleModal('reward-prompt');
      }
    });
  }, []);

  // The buttons for the prompt:
  let buttons = (
    <div className='text-right'>
      <button 
        type='button' 
        className='btn bg-gray mr-5'
        data-dismiss='modal'
      >
        No
      </button>
      <button 
        type='button' 
        className='btn btn-secondary'
        onClick={() => purchaseItem(promptItem.id)}
        data-dismiss='modal'
      >
        Yes
      </button>
    </div>
  );

  // The content of the prompt:
  let content;
  // The content changes based on whether the item is owned/equiped/unowned:
  if (promptItem.price == 'Owned') {
    content = (
      <div id='reward-modal-content'>
        <img src={promptItem.imgSrc} alt='Reward Item' />
        <div>Equip {promptItem.name}?</div>
      </div>
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

  function purchaseItem(id) {
    console.log(id);
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

export default PurchasePrompt;
