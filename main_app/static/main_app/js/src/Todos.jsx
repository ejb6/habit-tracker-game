import React from 'react';
// Datetime Picker for setting deadlines:
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
// Bootstrap Modal:
import Modal from './components/Modal';
// CSRF token for Django:
import csrftoken from './csrf';
import timeRemain from './timeRemain';

// A single todo item:
function TodoItem(props) {
  const [todo, setTodo] = React.useState(props.todo);
  // Used to mark/unmark a todo as completed:
  function markTodo(action) {
    // 'action' parameter can be 'mark' or 'unmark'
    // Send a fetch request to mark the todo in Django:
    fetch('/todos', {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrftoken },
      body: JSON.stringify({
        id: todo.id,
        action, // can be 'mark' or 'unmark'
      }),
    }).then((response) => {
      if (!response.ok) {
        // If something is wrong
        response.text().then((text) => alert(text));
      } else {
        alert('Success!');
        // Update the todo element:
        response.json().then((json) => {
          setTodo(json);
        });
      }
    });
  }

  function editTodo() {
    // The following block is used to prefill the edit form
    const form = document.querySelector('#edit-todo form');
    form.querySelector('input[name="id"]').value = todo.id;
    form.querySelector('input[name="title"]').value = todo.title;
    const desc = form.querySelector('textarea[name="description"]');
    desc.value = todo.description;
    const deadline = form.querySelector('input[name="deadline"]');
    let deadlineDate = new Date(todo.deadline);
    deadline.value = deadlineDate.toLocaleString();

    // The following is used to handle the delete button on the form:
    document.querySelector('#delete-edit-todo').onclick = () => {
      props.deleteTodo(todo.id);
    };

    // Handle edit form submission:
    form.onsubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      deadlineDate = new Date(formData.get('deadline'));
      formData.set('deadline', deadlineDate.toISOString());
      // Used to tell Django that the 'action' is editing a Todo:
      const dataObject = { action: 'edit' };
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

  // Classes of some element changes based on task completion
  // The div element for a single Todo item (buttons included):
  return (
    <div
      id={`todo${todo.id}`}
      className={todo.completed
        ? 'todo-item border-bottom mb-1 completed'
        : 'todo-item border-bottom mb-1'}
    >
      {todo.completed
        ? (
          <button
            type='button'
            className='btn bg-success'
            onClick={() => markTodo('unmark')}
          >
            <i className='fas fa-check-square' />
          </button>
        )
        : (
          <button
            type='button'
            className='btn bg-warning'
            onClick={() => markTodo('mark')}
          >
            <i className='far fa-check-square' />
          </button>
        )}
      <div className='py-1 overflow-hide todo-title'>
        <div>
          {todo.title}
        </div>
        <small className='todo-desc text-secondary'>
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
            className='btn delete-item-button'
            onClick={() => props.deleteTodo(todo.id)}
          >
            <i className='text-light far fa-trash-alt' />
          </button>
        )
        : (
          <button
            type='button'
            data-bs-toggle='modal'
            data-bs-target='#edit-todo'
            onClick={editTodo}
            className='btn delete-item-button'
          >
            <i className='text-light fas fa-pencil-alt' />
          </button>
        )}
    </div>
  );
}

// Button for adding todos:
function AddTodoButton() {
  return (
    <div className='mb-1 text-center add-item'>
      <button
        type='button'
        data-bs-toggle='modal'
        data-bs-target='#add-todo'
        className='btn bg-gray-200 w-100'
      >
        <i className='far fa-plus-square' />
        {' '}
        Add a Todo
      </button>
    </div>
  );
}

function TodoForm({ submit, formName }) {
  return (
    <form id={formName} onSubmit={submit}>
      <input type='hidden' name='id' />
      <input
        type='text'
        className='form-control mb-2'
        name='title'
        placeholder='Title'
      />
      <textarea
        name='description'
        className='form-control mb-2'
        placeholder='Description'
      />
      <Datetime inputProps={{ name: 'deadline', placeholder: 'Deadline' }} />
    </form>
  );
}

// Used for rendering the edit-todo form:
function EditTodoForm() {
  return <TodoForm submit={() => {}} formName='edit-todo-form' />;
  // The submit is blank since it will be changed dynamically
  // based on which Todo item is clicked
}

// Used for rendering and handling form submission for adding a Todo
function AddTodoForm({ setTodoAll, todoAll }) {
  // Submit the form
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const deadline = new Date(formData.get('deadline'));
    formData.set('deadline', deadline.toISOString());
    fetch('/todos', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        response.json().then((newTodo) => {
          setTodoAll([...todoAll, newTodo]);
        });
      } else {
        alert('Something is wrong');
      }
    });
    event.target.reset();
  };
  return <TodoForm submit={submit} formName='add-todo-form' />;
}

// Used to display all of the todo items together:
function Todos() {
  const [todoAll, setTodoAll] = React.useState([]);

  // Modals are used for adding/editing Todos
  // The buttons are used to set the footers of each Modal
  const addTodoSubmitButton = (
    <button
      form='add-todo-form'
      type='submit'
      data-bs-dismiss='modal'
      className='btn btn-success'
    >
      Save
    </button>
  );
  // The buttons are used to set the footers of each Modal
  const editTodoButtons = (
    <div>
      <button
        type='button'
        id='delete-edit-todo'
        data-bs-dismiss='modal'
        className='btn delete-item-button mx-2'
      >
        <i className='text-light far fa-trash-alt' />
      </button>
      <button
        id='submit-edit-todo'
        form='edit-todo-form'
        type='submit'
        data-bs-dismiss='modal'
        className='btn btn-success'
      >
        Save
      </button>
    </div>
  );

  //
  // Used to delete a Todo
  function deleteTodo(id) {
    fetch('/todos', {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrftoken },
      body: JSON.stringify({
        id,
        action: 'delete',
      }),
    }).then((response) => {
      if (response.ok) {
        // delete from state
        setTodoAll(
          todoAll.filter((todo) => todo.id !== id),
        );
      } else {
        response.text().then((text) => alert(text));
      }
    });
  }

  // This only runs on mount (does not run on state update);
  React.useEffect(() => {
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
      <AddTodoButton />
      <Modal
        title='Add a Todo'
        content=<AddTodoForm
          todoAll={todoAll}
          setTodoAll={setTodoAll}
        />
        footer={addTodoSubmitButton}
        modal_id='add-todo'
      />
      <Modal
        title='Edit a Todo'
        content=<EditTodoForm />
        footer={editTodoButtons}
        modal_id='edit-todo'
      />
      {todoAll.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
}

export default Todos;
