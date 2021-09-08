import React from 'react';
import PropTypes from 'prop-types';
// Datetime Picker for setting deadlines:
import Datetime from 'react-datetime';
import Modal from './components/Modal';
import { IconButton, SubmitButton } from './components/ModalButtons';
import FormInput from './components/FormInput';
import 'react-datetime/css/react-datetime.css';
import {
  deleteTodo,
  addTodoSubmit,
  editTodoSubmit,
  addHabitSubmit,
  editHabitSubmit,
  deleteHabit,
} from './functions';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Todos: line 14 - 190
function TodoForm({ formId, formData, onSubmit }) {
  const [deadline, setDeadline] = React.useState(null);
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setDeadline(new Date(formData.deadline));
    }
  }, [formData.deadline]);
  return (
    <form id={formId} onSubmit={onSubmit}>
      <div className='mb-5'>
        <FormInput
          formId={formId}
          name='title'
          defaultValue={formData.title}
        />
      </div>
      <div className='mb-5'>
        <FormInput
          formId={formId}
          name='description'
          defaultValue={formData.description}
        />
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
            value={deadline}
            onChange={(newDeadline) => setDeadline(newDeadline)}
          />
        </label>
      </div>
    </form>
  );
}

TodoForm.propTypes = {
  formId: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    deadline: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

TodoForm.defaultProps = {
  formData: {
    id: 0,
    title: '',
    description: '',
    deadline: (new Date()).toLocaleString(),
  },
};

function AddTodoForm({ setTodoAll }) {
  const formApp = (
    <TodoForm
      formId='add-todo-form'
      onSubmit={(event) => addTodoSubmit(event, setTodoAll)}
    />
  );

  const buttons = (
    <div className='text-right'>
      <IconButton
        classAdd='btn-dark mr-5'
        dismiss='modal'
        faIcon='fas fa-times'
      />
      <SubmitButton formId='add-todo-form' />
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
function EditTodoForm({ formData, setTodoAll }) {
  const formApp = (
    <TodoForm
      formId='edit-todo-form'
      formData={formData}
      onSubmit={(event) => editTodoSubmit(event, formData.id, setTodoAll)}
    />
  );

  const buttons = (
    <div className='text-right'>
      <IconButton
        classAdd='btn-dark mr-5'
        faIcon='fas fa-times'
      />
      <IconButton
        classAdd='btn-danger mr-5'
        faIcon='far fa-trash-alt'
        onClick={() => {
          deleteTodo(formData.id, setTodoAll);
        }}
      />
      <SubmitButton formId='edit-todo-form' />
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

EditTodoForm.propTypes = {
  formData: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  setTodoAll: PropTypes.func.isRequired,
};

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
      <IconButton
        classAdd='btn-dark mr-5'
        dismiss='modal'
        faIcon='fas fa-times'
      />
      <SubmitButton
        formId='add-habit-form'
      />
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
      <IconButton
        classAdd='btn-dark mr-5'
        faIcon='fas fa-times'
        dismiss='modal'
      />
      <IconButton
        classAdd='btn-danger mr-5'
        faIcon='far fa-trash-alt'
        dismiss='modal'
        onClick={() => deleteHabit(formData.id, setHabits)}
      />
      <SubmitButton
        formId='edit-habit-form'
      />
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
