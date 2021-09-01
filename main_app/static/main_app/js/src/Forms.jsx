import Modal from './components/Modal';
import React from 'react';
import ReactDOM from 'react-dom';
// Datetime Picker for setting deadlines:
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
// CSRF token for Django
import csrftoken from './csrf';
import {deleteTodo} from './functions';

function TodoForm({formId})   {
  return (
    <form id={formId}>
      <div className='mb-5'>
        <label>Title</label>
        <input type='text' className='form-control' placeholder='Title' name='title' />
      </div>
      <div className='mb-5'>
        <label>Description</label>
        <textarea className='form-control' placeholder='Description' name='description' />
      </div>
      <div className='mb-5'>
        <label>Deadline</label>
        <Datetime 
          inputProps={{'name': 'deadline', 'placeholder': 'Deadline'}}
        />
      </div>
    </form>
  );
}

function AddTodoForm({setTodoAll}) {
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
          setTodoAll(todoAllCurrent => {
            return [...todoAllCurrent, newTodo]
          });
        });
      } else {
        alert('Something is wrong');
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
      <a className='btn btn-dark mr-5' data-dismiss='modal' role='button'>
        <i className='fas fa-times'></i>
      </a>
      <a 
        onClick={addTodoSubmit}
        data-dismiss='modal'
        className='btn btn-secondary' 
        role='button'
      >
        Save
      </a>
    </div>
  );

  return (
    <Modal 
      modalId='add-todo-modal'
      title='Add a Todo' 
      content={formApp}
      buttons={buttons}
    />
  )
}

// Renders a Modal Form for editing a Todo item:
function EditTodoForm() {
  const formApp = (
    <TodoForm 
      formId='edit-todo-form' 
    />
  );

  const buttons = (
    <div className='text-right'>
      <a data-dismiss='modal' className='btn btn-dark mr-5' role='button'>
        <i className='fas fa-times'></i>
      </a>
      <a 
        data-dismiss='modal'
        className='btn btn-danger mr-5' 
        id='delete-edit-todo'
        role='button'
      >
        <i className='far fa-trash-alt' />
      </a>
      <a 
        data-dismiss='modal'
        id='submit-edit-todo'
        className='btn btn-secondary' 
        role='button'
      >
        Save
      </a>
    </div>
  );

  return (
    <Modal 
      modalId='edit-todo-modal'
      title='Edit a Todo' 
      content={formApp}
      buttons={buttons}
    />
  )
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
    const dataObject = { action: 'edit' , id: todo.id};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });
    fetch('/todos', {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrftoken },
      body: JSON.stringify(dataObject),
    }).then((response) => {
      if (!response.ok) {
        response.text().then((text) => alert(text));
      } else {
        response.json().then((json) => setTodo(json));
      }
    });
  };
}

export {AddTodoForm, EditTodoForm, editTodoSubmit};
