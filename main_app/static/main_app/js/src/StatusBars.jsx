import React from 'react';
import ReactDOM from 'react-dom';
import Todos from './Todos';

// This is the component for a single status bar: 
function StatusBar(props) {
  const percent = Math.round(100 * props.current / props.max);
  return (
    <div>
      <small id={props.id}>
        {props.stat + ' ' + props.current + '/' + props.max}
      </small>
      <div className="progress">
        <div 
          className={"progress-bar " + props.bgColor}
          role="progressbar" 
          style={{width: percent + '%'}} 
          aria-valuenow={props.current} 
          aria-valuemin="0" 
          aria-valuemax={props.max}
        >
        </div>
      </div>
    </div>
  );
}

// For rendering all status bars
function StatusBars() {
  const [state, setState] = React.useState({});

  // For fetching player status:
  function fetchStats() {
    fetch('/stats').then((response) => response.json())
      .then(json => {
        setState(json);
      });
  }

  // Runs on mount only (does not run on state update)
  React.useEffect(() => {
    // Render the List of Todos:
    ReactDOM.render(
      <Todos fetchStats={fetchStats} />, 
      document.querySelector('#todo-items')
    );
    fetchStats();
  }, []);

  return (
    <div>
      <h6 className="border-bottom mb-10">
        {state.nickname}, Level {state.level} 
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
    </div>
  );
}

export default StatusBars;
