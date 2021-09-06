import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AddHabitForm, EditHabitForm } from './Forms';
import { markHabit } from './functions';

function HabitItem({ habit, setFormData, setHabits }) {
  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):

  let streakIcon = <i className='fas fa-bolt pr-5' />;
  let markButton = (
    <button
      type='button'
      className='bg-secondary mr-10 mark'
      onClick={() => markHabit(habit.id, setHabits)}
    >
      <i className='fas fa-plus-circle' />
    </button>
  );
  if (habit.isBad) {
    streakIcon = <i className='fas fa-heart-broken pr-5' />;
    markButton = (
      <button
        type='button'
        className='bg-warning mr-10 mark'
        onClick={() => markHabit(habit.id, setHabits)}
      >
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
      <button
        type='button'
        className='delete-item-button bg-gray'
        onClick={() => {
          window.halfmoon.toggleModal('edit-habit-modal');
          setFormData(habit);
        }}
      >
        <i className='fas fa-pencil-alt' />
      </button>
    </div>
  );
}

HabitItem.propTypes = {
  habit: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    desc: PropTypes.string,
    streak: PropTypes.number,
    isBad: PropTypes.bool,
    lastChecked: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  setHabits: PropTypes.func.isRequired,
};

function HabitItems() {
  const [habits, setHabits] = React.useState([]);
  const [formData, setFormData] = React.useState({});
  React.useEffect(() => {
    fetch('/habits')
      .then((response) => response.json())
      .then((json) => setHabits(json));
    ReactDOM.render(
      <AddHabitForm setHabits={setHabits} />,
      document.querySelector('#add-habit'),
    );
  }, []);
  React.useEffect(() => {
    ReactDOM.render(
      <EditHabitForm
        setHabits={setHabits}
        formData={formData}
        key={1}
      />,
      document.querySelector('#edit-habit'),
    );
  }, [formData]);
  return (
    <div>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          setFormData={setFormData}
          setHabits={setHabits}
        />
      ))}
    </div>
  );
}

export default HabitItems;
