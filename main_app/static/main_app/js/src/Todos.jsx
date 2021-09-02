// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is used for rendering Todos
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import ReactDOM from 'react-dom';
// CSRF token for Django:
import csrftoken from './csrf';
import {timeRemain, markTodo, deleteTodo} from './functions';
import {AddTodoForm, EditTodoForm, editTodoSubmit} from './Forms';

// A single todo item:
function TodoItem(props) {
  const [todo, setTodo] = React.useState(props.todo);

  // The following ID is for editing a todo item:
  const editTodoButtonId = 'edit-todo-button-' + todo.id;
  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):
  return (
    <div
      id={`todo${todo.id}`}
      className={todo.completed
        ? 'todo-item border-bottom mb-5 completed'
        : 'todo-item border-bottom mb-5'}
    >
      {todo.completed
        ? (
          <button
            type='button'
            className='bg-secondary mr-10 mark'
            onClick={() => {
              markTodo('unmark', todo.id, setTodo, props.fetchStats);
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
              markTodo('mark', todo.id, setTodo, props.fetchStats);
            }}
          >
            <i className='far fa-check-square' />
          </button>
        )}
      <div className='py-5 overflow-hide todo-title'>
        <div>
          {todo.title}
        </div>
        <small className='todo-desc text-teal'>
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
            onClick={() => deleteTodo(todo.id, props.setTodoAll)}
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
              editTodoSubmit(todo, setTodo, props.setTodoAll);
              halfmoon.toggleModal('edit-todo-modal');
            }}
          >
            <i className='fas fa-pencil-alt' />
          </button>
        )}
    </div>
  );
}


// Used to display all of the todo items together:
function Todos({fetchStats}) {
  const [todoAll, setTodoAll] = React.useState([]);

  // Delete Todo 
  const deleteTodoLocal = (todo_id) => {
    deleteTodo(todo_id, setTodoAll);
  }

  // This only runs on mount (does not run on state update);
  React.useEffect(() => {
    // Render the form for adding todos:
    ReactDOM.render(
      <AddTodoForm setTodoAll={setTodoAll} />, 
      document.querySelector('#add-todo')
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
          todo={todo}
          setTodoAll={setTodoAll}
          fetchStats={fetchStats}
        />
      ))}
    </div>
  );
}

export default Todos;
