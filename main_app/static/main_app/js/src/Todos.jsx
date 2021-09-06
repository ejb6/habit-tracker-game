// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is used for rendering Todos
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// CSRF token for Django:
import { timeRemain, markTodo, deleteTodo } from './functions';
import { AddTodoForm, editTodoSubmit } from './Forms';

// A single todo item:
function TodoItem({ todoInput, fetchStats, setTodoAll }) {
  const [todo, setTodo] = React.useState(todoInput);
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
              markTodo('unmark', todo.id, setTodo, fetchStats);
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
              markTodo('mark', todo.id, setTodo, fetchStats);
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
              editTodoSubmit(todo, setTodo, setTodoAll);
              // eslint-disable-next-line no-undef
              halfmoon.toggleModal('edit-todo-modal');
            }}
          >
            <i className='fas fa-pencil-alt' />
          </button>
        )}
    </div>
  );
}

TodoItem.propTypes = {
  todoInput: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    deadline: PropTypes.string,
    completed: PropTypes.string,
  }).isRequired,
  fetchStats: PropTypes.func.isRequired,
  setTodoAll: PropTypes.func.isRequired,
};

// Used to display all of the todo items together:
function Todos({ fetchStats }) {
  const [todoAll, setTodoAll] = React.useState([]);

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

  return (
    <div>
      {todoAll.map((todo) => (
        <TodoItem
          key={todo.id}
          todoInput={todo}
          setTodoAll={setTodoAll}
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
