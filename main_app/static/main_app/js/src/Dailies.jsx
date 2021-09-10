import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TaskButton from './components/TaskButtons';
import TaskBody from './components/TaskBody';
import { AddDailyForm, EditDailyForm } from './Forms';
import { dailyIsCompleted, markDaily } from './functions';

function Daily({
  daily, setEditData, setDailies, fetchStats,
}) {
  let markColor;
  let markIcon;
  let markAction;
  if (dailyIsCompleted(daily)) {
    markColor = 'bg-secondary';
    markIcon = 'fas fa-check-square';
    markAction = 'unmark';
  } else {
    markColor = 'bg-warning';
    markIcon = 'far fa-check-square';
    markAction = 'mark';
  }
  return (
    <div className='task-item border-bottom mb-5'>
      <TaskButton
        className={`${markColor} mark mr-10`}
        onClick={() => {
          markDaily(daily.id, markAction, setDailies, fetchStats);
        }}
        faIcon={markIcon}
      />
      <TaskBody
        title={daily.title}
        subtext={daily.description}
      />
      <TaskButton
        className='bg-gray'
        onClick={() => {
          setEditData(daily);
          window.halfmoon.toggleModal('edit-daily-modal');
        }}
        faIcon='fas fa-pencil-alt'
      />
    </div>
  );
}

Daily.propTypes = {
  daily: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    lastCompleted: PropTypes.string,
  }).isRequired,
  setEditData: PropTypes.func.isRequired,
  setDailies: PropTypes.func.isRequired,
  fetchStats: PropTypes.func.isRequired,
};

function DailyItems({ fetchStats }) {
  const [dailies, setDailies] = React.useState([]);
  const [editData, setEditData] = React.useState({
    id: 0,
    title: '',
  });
  React.useEffect(() => {
    fetch('/dailies')
      .then((response) => response.json())
      .then((json) => setDailies(json));
    ReactDOM.render(
      <AddDailyForm setDailies={setDailies} />,
      document.querySelector('#add-daily'),
    );
  }, []);
  React.useEffect(() => {
    ReactDOM.render(
      <EditDailyForm
        setDailies={setDailies}
        editData={editData}
      />,
      document.querySelector('#edit-daily'),
    );
  }, [editData]);
  return (
    <div>
      {dailies.map((daily) => (
        <Daily
          key={daily.id}
          daily={daily}
          setEditData={setEditData}
          setDailies={setDailies}
          fetchStats={fetchStats}
        />
      ))}
    </div>
  );
}
DailyItems.propTypes = {
  fetchStats: PropTypes.func.isRequired,
};

export default DailyItems;
