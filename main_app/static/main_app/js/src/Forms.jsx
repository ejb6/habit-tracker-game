/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
// Datetime Picker for setting deadlines:
import Datetime from 'react-datetime';
import Modal from './components/Modal';
import 'react-datetime/css/react-datetime.css';
// CSRF token for Django
import csrftoken from './csrf';
import { deleteTodo, modalAlert } from './functions';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Todos: line 14 - 190
function TodoForm({ formId }) {
  return (
    <form id={formId}>
      <div className='mb-5'>
        <label className='w-full'>
          Title
          <input type='text' className='form-control' placeholder='Title' name='title' />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full'>
          Description
          <textarea className='form-control' placeholder='Description' name='description' />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full'>
          Deadline
          <Datetime
            inputProps={{ name: 'deadline', placeholder: 'Deadline' }}
          />
        </label>
      </div>
    </form>
  );
}

TodoForm.propTypes = {
  formId: PropTypes.string,
};
TodoForm.defaultProps = {
  formId: 'form-default',
};

function AddTodoForm({ setTodoAll }) {
  // Used for handling form submission for adding a Todo
  function addTodoSubmit() {
    const formElement = document.querySelector('#add-todo-form');
    const formData = new FormData(formElement);
    const deadline = new Date(formData.get('deadline'));
    formData.set('deadline', deadline.toISOString());
    fetch('/todos', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        response.json().then((newTodo) => {
          setTodoAll((todoAllCurrent) => [...todoAllCurrent, newTodo]);
        });
      } else {
        modalAlert('Something is wrong');
      }
    });
    formElement.reset();
  }

  const formApp = (
    <TodoForm
      formId='add-todo-form'
    />
  );

  const buttons = (
    <div className='text-right'>
      <button className='btn btn-dark mr-5' data-dismiss='modal' type='button'>
        <i className='fas fa-times' />
      </button>
      <button
        onClick={addTodoSubmit}
        data-dismiss='modal'
        className='btn btn-secondary'
        type='button'
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      modalId='add-todo-modal'
      title='Add a Todo'
      content={formApp}
      buttons={buttons}
    />
  );
}

AddTodoForm.propTypes = {
  setTodoAll: PropTypes.func,
};
AddTodoForm.defaultProps = {
  setTodoAll: () => {},
};

// Renders a Modal Form for editing a Todo item:
function EditTodoForm() {
  const formApp = (
    <TodoForm
      formId='edit-todo-form'
    />
  );

  const buttons = (
    <div className='text-right'>
      <button data-dismiss='modal' className='btn btn-dark mr-5' type='button'>
        <i className='fas fa-times' />
      </button>
      <button
        data-dismiss='modal'
        className='btn btn-danger mr-5'
        id='delete-edit-todo'
        type='button'
      >
        <i className='far fa-trash-alt' />
      </button>
      <button
        data-dismiss='modal'
        id='submit-edit-todo'
        className='btn btn-secondary'
        type='button'
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      modalId='edit-todo-modal'
      title='Edit a Todo'
      content={formApp}
      buttons={buttons}
    />
  );
}

// This function handles submission for editing Todos
function editTodoSubmit(todo, setTodo, setTodoAll) {
  // The following block is used to prefill the edit form
  const form = document.querySelector('#edit-todo-form');
  form.querySelector('input[name="title"]').value = todo.title;
  const desc = form.querySelector('textarea[name="description"]');
  desc.value = todo.description;
  const deadline = form.querySelector('input[name="deadline"]');
  let deadlineDate = new Date(todo.deadline);
  deadline.value = deadlineDate.toLocaleString();

  // The following is used to handle the delete button on the form:
  document.querySelector('#delete-edit-todo').onclick = () => {
    deleteTodo(todo.id, setTodoAll);
  };

  // Handle edit form submission:
  document.querySelector('#submit-edit-todo').onclick = () => {
    const formData = new FormData(form);
    deadlineDate = new Date(formData.get('deadline'));
    formData.set('deadline', deadlineDate.toISOString());
    // Used to tell Django that the 'action' is to edit a Todo:
    const dataObject = { action: 'edit', id: todo.id };
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });
    fetch('/todos', {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrftoken },
      body: JSON.stringify(dataObject),
    }).then((response) => {
      if (!response.ok) {
        response.text().then((text) => modalAlert(text));
      } else {
        response.json().then((json) => setTodo(json));
      }
    });
  };
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Habits: line 193 -
function HabitForm({ formId }) {
  return (
    <form id={formId}>
      <div className='mb-5'>
        <label className='w-full'>
          Title
          <input type='text' className='form-control' placeholder='Title' name='title' />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full'>
          Description
          <textarea className='form-control' placeholder='Description' name='description' />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full'>
          Good Habit
          <input type='radio' className='form-control' name='habit-type' />
        </label>
        <label className='w-full'>
          Bad Habit
          <input type='radio' className='form-control' name='habit-type' />
        </label>
      </div>
    </form>
  );
}

HabitForm.propTypes = {
  formId: PropTypes.string,
};
HabitForm.defaultProps = {
  formId: 'default-form-id',
};

function AddHabitForm() {
  return (
    <Modal
      modalId='add-habit-modal'
      title='Add a Habit'
      content={<HabitForm formId='add-habit-form' />}
    />
  );
}

export {
  AddTodoForm,
  EditTodoForm,
  editTodoSubmit,
  AddHabitForm,
};
