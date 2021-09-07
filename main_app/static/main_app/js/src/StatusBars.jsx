// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is for displaying health, exp, gold
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Todos from './Todos';
import HabitItems from './Habits';
import { alertNotif } from './functions';

// This is the component for a single status bar:
function StatusBar({
  id, stat, current, max, bgColor,
}) {
  const percent = Math.round(100 * (current / max));
  return (
    <div>
      <small id={id}>
        {`${stat} ${current}/${max}`}
      </small>
      <div className='progress'>
        <div
          className={`progress-bar ${bgColor}`}
          role='progressbar'
          style={{ width: `${percent}%` }}
          aria-valuenow={current}
          aria-valuemin='0'
          aria-valuemax={max}
          aria-label='Health'
        />
      </div>
    </div>
  );
}

StatusBar.propTypes = {
  id: PropTypes.string,
  stat: PropTypes.string,
  current: PropTypes.number,
  max: PropTypes.number,
  bgColor: PropTypes.string,
};
StatusBar.defaultProps = {
  id: 'none',
  stat: 'None',
  current: 0,
  max: 0,
  bgColor: 'bg-dark',
};

// For displaying the player's gold:
function Gold({ gold }) {
  return ReactDOM.createPortal(gold, document.querySelector('#gold'));
}

// For rendering all status bars
function StatusBars() {
  const [state, setState] = React.useState({});
  // For fetching player status:
  const fetchStats = () => {
    fetch('/stats').then((response) => response.json())
      .then((json) => {
        setState((stateCurrent) => {
          if (stateCurrent === {}) {
            // pass
          } else if (json.level > stateCurrent.level) {
            alertNotif('Level Up!');
          } else if (json.expCurrent > stateCurrent.expCurrent) {
            alertNotif('Good Job!');
          }
          return json;
        });
      });
  };
  // Runs on mount only (does not run on state update)
  React.useEffect(() => {
    // Render the List of Todos:
    ReactDOM.render(
      <Todos fetchStats={fetchStats} />,
      document.querySelector('#todo-items'),
    );
    // Habit Items
    ReactDOM.render(
      <HabitItems fetchStats={fetchStats} />,
      document.querySelector('#habit-items'),
    );
    fetchStats();
  }, []);
  return (
    <div>
      <h6 className='border-bottom mb-10'>
        {state.nickname}
        , Level
        {state.level}
      </h6>
      <StatusBar
        id='health'
        stat='Health'
        current={state.healthCurrent}
        max={state.healthMax}
        bgColor='bg-danger'
      />
      <StatusBar
        id='exp'
        stat='Exp'
        current={state.expCurrent}
        max={state.expNext}
        bgColor='bg-indigo'
      />
      <Gold gold={state.gold} />
    </div>
  );
}

export default StatusBars;
