// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// This file is used for rendering Todos
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// CSRF token for Django:
import { timeRemain, markTodo, deleteTodo } from './functions';
import { AddTodoForm, EditTodoForm } from './Forms';
import TaskButton from './components/TaskButtons';
import TaskBody from './components/TaskBody';

// A single todo item:
function TodoItem({
  todo, fetchStats, setTodos, setFormData,
}) {
  // Some elements change based on task completion
  let todoClass;
  let markFunction; // for marking todos as completed
  let markButtonColor;
  let markIcon;
  let editFunction; // for deleting or editing
  let editIcon;
  if (todo.completed) {
    todoClass = 'task-item border-bottom mb-5 completed';
    markFunction = () => {
      markTodo('unmark', todo.id, setTodos, fetchStats);
    };
    markButtonColor = 'bg-secondary';
    markIcon = 'fas fa-check-square';
    editFunction = () => deleteTodo(todo.id, setTodos);
    editIcon = 'far fa-trash-alt';
  } else {
    todoClass = 'task-item border-bottom mb-5';
    markFunction = () => {
      markTodo('mark', todo.id, setTodos, fetchStats);
    };
    markButtonColor = 'bg-warning';
    markIcon = 'far fa-check-square';
    editFunction = () => {
      setFormData(todo);
      window.halfmoon.toggleModal('edit-todo-modal');
    };
    editIcon = 'fas fa-pencil-alt';
  }

  const description = todo.description ? `: ${todo.description}` : '';
  return (
    <div id={`todo${todo.id}`} className={todoClass}>
      <TaskButton
        className={`${markButtonColor} mr-10 mark`}
        onClick={markFunction}
        faIcon={markIcon}
      />
      <TaskBody
        title={todo.title}
        subtext={timeRemain(todo.deadline) + description}
      />
      <TaskButton
        className='bg-gray'
        faIcon={editIcon}
        onClick={editFunction}
      />
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
  setTodos: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

// Used to display all of the todo items together:
function Todos({ fetchStats }) {
  const [todos, setTodos] = React.useState([]);
  // Form data for editing todos:
  const [formData, setFormData] = React.useState({});

  // This only runs on mount (does not run on state update);
  React.useEffect(() => {
    // Render the form for adding todos:
    ReactDOM.render(
      <AddTodoForm setTodos={setTodos} />,
      document.querySelector('#add-todo'),
    );

    // Fetch all todos from Django:
    fetch('/todos').then((response) => response.json())
      .then((todosFetched) => {
        setTodos(todosFetched);
      });
    return () => {
      setTodos([]);
    };
  }, []);

  React.useEffect(() => {
    // Render the form for editing a Todo:
    ReactDOM.render(
      <EditTodoForm
        formData={formData}
        setTodos={setTodos}
      />,
      document.querySelector('#edit-todo'),
    );
  }, [formData]);

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
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
