import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AddHabitForm, EditHabitForm } from './Forms';
import { markHabit } from './functions';
import TaskButton from './components/TaskButtons';
import TaskBody from './components/TaskBody';

function HabitItem({
  habit, setFormData, setHabits, fetchStats,
}) {
  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):
  let streakIcon = <i className='fas fa-bolt pr-5' />;
  let markButton = (
    <TaskButton
      className='bg-secondary mark mr-10'
      onClick={() => markHabit(habit.id, setHabits, fetchStats)}
      faIcon='fas fa-plus-circle'
    />
  );
  if (habit.isBad) {
    streakIcon = <i className='fas fa-heart-broken pr-5' />;
    markButton = (
      <TaskButton
        className='bg-warning mark mr-10'
        onClick={() => {
          markHabit(habit.id, setHabits, fetchStats);
        }}
        faIcon='fas fa-minus-circle'
      />
    );
  }
  return (
    <div className='task-item border-bottom mb-5'>
      {markButton}
      <TaskBody
        title={habit.title}
        subtext={(
          <span>
            {streakIcon}
            {habit.streak}
          </span>
        )}
      />
      <TaskButton
        className='delete-item-button bg-gray'
        onClick={() => {
          window.halfmoon.toggleModal('edit-habit-modal');
          setFormData(habit);
        }}
        faIcon='fas fa-pencil-alt'
      />
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
  fetchStats: PropTypes.func.isRequired,
};

function HabitItems({ fetchStats }) {
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
          fetchStats={fetchStats}
        />
      ))}
    </div>
  );
}

HabitItems.propTypes = {
  fetchStats: PropTypes.func.isRequired,
};

export default HabitItems;
