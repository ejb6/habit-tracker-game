import React from 'react';
import PropTypes from 'prop-types';
// Datetime Picker for setting deadlines:
import Datetime from 'react-datetime';
import Modal from './components/Modal';
import 'react-datetime/css/react-datetime.css';
// CSRF token for Django
import csrftoken from './csrf';
import {
  deleteTodo,
  alertNotif,
  addHabitSubmit,
  editHabitSubmit,
  deleteHabit,
} from './functions';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Todos: line 14 - 190
function TodoForm({ formId }) {
  return (
    <form id={formId}>
      <div className='mb-5'>
        <label className='w-full' htmlFor={`${formId}-title`}>
          Title
          <input
            id={`${formId}-title`}
            type='text'
            className='form-control'
            placeholder='Title'
            name='title'
          />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full' htmlFor={`${formId}-desc`}>
          Description
          <textarea
            id={`${formId}-desc`}
            className='form-control'
            placeholder='Description'
            name='description'
          />
        </label>
      </div>
      <div className='mb-5'>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className='w-full' htmlFor={`${formId}-deadline`}>
          Deadline
          <Datetime
            inputProps={{
              id: `${formId}-deadline`,
              name: 'deadline',
              placeholder: 'Deadline',
            }}
          />
        </label>
      </div>
    </form>
  );
}

TodoForm.propTypes = {
  formId: PropTypes.string.isRequired,
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
        alertNotif('Something is wrong');
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
  setTodoAll: PropTypes.func.isRequired,
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
        response.text().then((text) => alertNotif(text));
      } else {
        response.json().then((json) => setTodo(json));
      }
    });
  };
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Habits: line 193 -
function HabitForm({
  formId, formData, formSubmit, setHabits,
}) {
  const badHabitButton = React.useRef(null);
  const goodHabitButton = React.useRef(null);
  React.useEffect(() => {
    badHabitButton.current.checked = formData.isBad;
    goodHabitButton.current.checked = !formData.isBad;
  });
  return (
    <form
      id={formId}
      onSubmit={(event) => formSubmit(event, setHabits, formData.id)}
    >
      <div className='mb-5'>
        <label className='w-full' htmlFor={`${formId}-title`}>
          Title
          <input
            type='text'
            id={`${formId}-title`}
            className='form-control'
            placeholder='Title'
            name='title'
            defaultValue={formData.title}
            required
          />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full' htmlFor={`${formId}-desc`}>
          Description
          <textarea
            className='form-control'
            id={`${formId}-desc`}
            placeholder='Description'
            defaultValue={formData.desc}
            name='description'
          />
        </label>
      </div>
      <div className='mb-5'>
        <label className='w-full' htmlFor={`${formId}-streak`}>
          <i className='fas fa-bolt pr-5' />
          Streak /
          <i className='fas fa-heart-broken px-5' />
          Relapses
          <input
            type='number'
            id={`${formId}-streak`}
            className='form-control'
            placeholder='0 by default'
            name='streak'
            defaultValue={formData.streak}
          />
        </label>
      </div>
      <div className='mb-5'>
        <div className='mb-5'>
          Select habit type:
        </div>
        <div className='custom-radio mb-5'>
          <input
            id={`${formId}-good`}
            value='good'
            type='radio'
            name='habit-type'
            ref={goodHabitButton}
            required
          />
          <label htmlFor={`${formId}-good`}>Good Habit</label>
        </div>
        <div className='custom-radio'>
          <input
            id={`${formId}-bad`}
            value='bad'
            type='radio'
            name='habit-type'
            ref={badHabitButton}
            required
          />
          <label htmlFor={`${formId}-bad`}>Bad Habit</label>
        </div>
      </div>
    </form>
  );
}

HabitForm.propTypes = {
  formId: PropTypes.string.isRequired,
  formSubmit: PropTypes.func.isRequired,
  setHabits: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    desc: PropTypes.string,
    isBad: PropTypes.bool,
    streak: PropTypes.number,
  }),
};

HabitForm.defaultProps = {
  formData: {
    title: '',
    desc: '',
    isBad: false,
    streak: null,
  },
};

function AddHabitForm({ setHabits }) {
  const buttons = (
    <div className='text-right'>
      <button className='btn btn-dark mr-5' data-dismiss='modal' type='button'>
        <i className='fas fa-times' />
      </button>
      <button
        className='btn btn-secondary'
        type='submit'
        form='add-habit-form'
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      modalId='add-habit-modal'
      title='Add a Habit'
      content={(
        <HabitForm
          formId='add-habit-form'
          formSubmit={addHabitSubmit}
          setHabits={setHabits}
        />
      )}
      buttons={buttons}
    />
  );
}

AddHabitForm.propTypes = {
  setHabits: PropTypes.func.isRequired,
};

function EditHabitForm({ setHabits, formData }) {
  const buttons = (
    <div className='text-right'>
      <button className='btn btn-dark mr-5' data-dismiss='modal' type='button'>
        <i className='fas fa-times' />
      </button>
      <button
        className='btn btn-danger mr-5'
        data-dismiss='modal'
        type='button'
        onClick={() => deleteHabit(formData.id, setHabits)}
      >
        <i className='far fa-trash-alt' />
      </button>
      <button
        className='btn btn-secondary'
        type='submit'
        form='edit-habit-form'
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      modalId='edit-habit-modal'
      title='Edit a Habit'
      content={(
        <HabitForm
          formId='edit-habit-form'
          formData={formData}
          formSubmit={editHabitSubmit}
          setHabits={setHabits}
        />
      )}
      buttons={buttons}
    />
  );
}

EditHabitForm.propTypes = {
  formData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    streak: PropTypes.number,
    isBad: PropTypes.bool,
    lastChecked: PropTypes.string,
  }).isRequired,
  setHabits: PropTypes.func.isRequired,
};

export {
  AddTodoForm,
  EditTodoForm,
  editTodoSubmit,
  AddHabitForm,
  EditHabitForm,
};
