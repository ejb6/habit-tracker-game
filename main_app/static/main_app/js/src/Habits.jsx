import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AddHabitForm } from './Forms';

function HabitItem({ habit }) {
  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):
  let streakIcon = <i className='fas fa-bolt pr-5' />;
  let markButton = (
    <button type='button' className='bg-secondary mr-10 mark'>
      <i className='fas fa-plus-circle' />
    </button>
  );
  if (habit.isBad) {
    streakIcon = <i className='fas fa-heart-broken pr-5' />;
    markButton = (
      <button type='button' className='bg-warning mr-10 mark'>
        <i className='fas fa-minus-circle' />
      </button>
    );
  }
  return (
    <div className='task-item border-bottom mb-5'>
      {markButton}
      <div className='py-5 overflow-hide task-title'>
        <div>
          {habit.title}
        </div>
        <small className='text-teal'>
          <span>
            {streakIcon}
            {habit.streak}
          </span>
        </small>
      </div>
      <button type='button' className='delete-item-button bg-gray'>
        <i className='fas fa-pencil-alt' />
      </button>
    </div>
  );
}

HabitItem.propTypes = {
  habit: PropTypes.shape({
    title: PropTypes.string,
    streak: PropTypes.number,
    isBad: PropTypes.bool,
    lastChecked: PropTypes.string,
  }),
};
HabitItem.defaultProps = {
  habit: {
    title: '',
    streak: 0,
    isBad: false,
    lastChecked: '',
  },
};

function HabitItems() {
  const [habits, setHabits] = React.useState([]);
  React.useEffect(() => {
    fetch('/habits')
      .then((response) => response.json())
      .then((json) => setHabits(json));
    ReactDOM.render(
      <AddHabitForm />,
      document.querySelector('#add-habit'),
    );
  }, []);
  return (
    <div>
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </div>
  );
}

export default HabitItems;
