// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is used for rendering Todos
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// CSRF token for Django:
import { timeRemain, markTodo, deleteTodo } from './functions';
import { AddTodoForm, EditTodoForm } from './Forms';

// A single todo item:
function TodoItem({
  todo, fetchStats, setTodoAll, setFormData,
}) {
  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):
  return (
    <div
      id={`todo${todo.id}`}
      className={todo.completed
        ? 'task-item border-bottom mb-5 completed'
        : 'task-item border-bottom mb-5'}
    >
      {todo.completed
        ? (
          <button
            type='button'
            className='bg-secondary mr-10 mark'
            onClick={() => {
              markTodo('unmark', todo.id, setTodoAll, fetchStats);
            }}
          >
            <i className='fas fa-check-square' />
          </button>
        )
        : (
          <button
            type='button'
            className='bg-warning mr-10 mark'
            onClick={() => {
              markTodo('mark', todo.id, setTodoAll, fetchStats);
            }}
          >
            <i className='far fa-check-square' />
          </button>
        )}
      <div className='py-5 overflow-hide task-title'>
        <div>
          {todo.title}
        </div>
        <small className='text-teal'>
          <span>
            {timeRemain(todo.deadline)}
          </span>
          <span>
            {todo.description ? `: ${todo.description}` : ''}
          </span>
        </small>
      </div>
      {todo.completed
        ? (
          <button
            type='button'
            className='delete-item-button bg-gray'
            onClick={() => deleteTodo(todo.id, setTodoAll)}
          >
            <i className='far fa-trash-alt' />
          </button>
        )
        : (
          <button
            type='button'
            className='delete-item-button bg-gray'
            data-dismiss='modal'
            onClick={() => {
              setFormData(todo);
              window.halfmoon.toggleModal('edit-todo-modal');
            }}
          >
            <i className='fas fa-pencil-alt' />
          </button>
        )}
    </div>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    deadline: PropTypes.string,
    completed: PropTypes.string,
  }).isRequired,
  fetchStats: PropTypes.func.isRequired,
  setTodoAll: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

// Used to display all of the todo items together:
function Todos({ fetchStats }) {
  const [todoAll, setTodoAll] = React.useState([]);
  // Form data for editing todos:
  const [formData, setFormData] = React.useState({});

  // This only runs on mount (does not run on state update);
  React.useEffect(() => {
    // Render the form for adding todos:
    ReactDOM.render(
      <AddTodoForm setTodoAll={setTodoAll} />,
      document.querySelector('#add-todo'),
    );

    // Fetch all todos from Django:
    fetch('/todos').then((response) => response.json())
      .then((todoAllFetched) => {
        setTodoAll(todoAllFetched);
      });
    return () => {
      setTodoAll([]);
    };
  }, []);

  React.useEffect(() => {
    // Render the form for editing a Todo:
    ReactDOM.render(
      <EditTodoForm
        formData={formData}
        setTodoAll={setTodoAll}
      />,
      document.querySelector('#edit-todo'),
    );
  }, [formData]);

  return (
    <div>
      {todoAll.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodoAll={setTodoAll}
          setFormData={setFormData}
          fetchStats={fetchStats}
        />
      ))}
    </div>
  );
}

Todos.propTypes = {
  fetchStats: PropTypes.func.isRequired,
};

export default Todos;
