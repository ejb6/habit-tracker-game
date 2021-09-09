import React from 'react';
import PropTypes from 'prop-types';
import TaskButton from './components/TaskButtons';
import TaskBody from './components/TaskBody';

function Daily({ daily }) {
  return (
    <div className='task-item border-bottom mb-5'>
      <TaskButton
        className='bg-secondary mark mr-10'
        onClick={() => {}}
        faIcon='far fa-check-square'
      />
      <TaskBody
        title={daily.title}
        subtext={daily.description}
      />
      <TaskButton
        className='bg-gray'
        onClick={() => {}}
        faIcon='far fa-check-square'
      />
    </div>
  );
}

Daily.propTypes = {
  daily: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    lastCompleted: PropTypes.string,
  }).isRequired,
};

function DailyItems() {
  const [dailies, setDailies] = React.useState([]);
  React.useEffect(() => {
    fetch('/dailies')
      .then((response) => response.json())
      .then((json) => setDailies(json));
  }, []);
  return (
    <div>
      {dailies.map((daily) => (
        <Daily
          daily={daily}
        />
      ))}
    </div>
  );
}

export default DailyItems;
