import csrftoken from './csrf';
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// The contents of this file are functions that are not used
// for rendering JSX components. Most of the functions are used
// to communicate with the backend to perform actions like
// marking a todo as completed etc.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// This is used to calculate the remaining time before a deadline:
function timeRemain(deadlineStr) {
  const dateNow = new Date();
  const dateDeadline = new Date(deadlineStr);
  // Time difference in days:
  let diff = Math.round((dateDeadline - dateNow) / (1000 * 60 * 60 * 24));
  // Return value:
  let remain = '';
  // Way past deadline:
  if (diff < -1) {
    remain = `${-diff} days overdue`;
    // Deadline is not yet near:
  } else if (diff > 1) {
    remain = `${diff} days left`;
  } else {
    // Less than 24 hours left:
    // Time difference in hours:
    diff = Math.round((dateDeadline - dateNow) / (1000 * 60 * 60));
    if (diff === 0) {
      remain = 'Less than 30 mins left';
    } else if (diff === 1) {
      remain = '1 hour left';
    } else if (diff > 1) {
      remain = `${diff} hours left`;
    } else {
      // Less than 1 day overdue:
      remain = 'Overdue';
    }
  }
  return remain;
}

// Used for showing rewards received when completing a task:
function alertNotif(text) {
  const popup = document.querySelector('#alert-popup');
  popup.children[0].innerHTML = text;
  popup.style.display = 'block';
  // Dismiss popup after 4 seconds:
  setTimeout(() => { popup.style.display = 'none'; }, 5000);
}

// Used to mark/unmark a todo as completed:
function markTodo(action, todoId, setTodo, fetchStats) {
  // 'action' parameter can be 'mark' or 'unmark'
  // Send a fetch request to mark the todo in Django:
  fetch('/todos', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: todoId,
      action, // can be 'mark' or 'unmark'
    }),
  }).then((response) => {
    if (!response.ok) {
      // If something is wrong
      response.text().then((text) => alertNotif(text));
    } else {
      fetchStats();
      // Update the todo element:
      response.json().then((json) => {
        setTodo(json);
      });
    }
  });
}

// Used to delete a Todo
function deleteTodo(id, setTodoAll) {
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
      setTodoAll((todoAll) => todoAll.filter((todo) => todo.id !== id));
    } else {
      response.text().then((text) => alertNotif(text));
    }
  });
}

// Used to equip an avatar
function equipAvatar(id) {
  fetch(`/equip_avatar/${id}`)
    .then((response) => {
      if (response.ok) {
        window.location.reload(true);
      } else {
        response.text().then((text) => alertNotif(text));
      }
    });
}

// Used to purchase a reward:
function purchaseAvatar(id) {
  fetch(`/purchase/${id}`)
    .then((response) => {
      if (response.ok) {
        window.location.reload(true);
      } else {
        response.text().then((text) => alertNotif(text));
      }
    });
}

function markHabit(habitId, setHabits, fetchStats) {
  fetch('/habits', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: habitId,
      action: 'mark',
    }),
  }).then((response) => {
    if (response.ok) {
      setHabits((habits) => (habits.map((habit) => (
        habit.id === habitId
          ? { ...habit, streak: habit.streak + 1 }
          : habit
      ))));
      fetchStats();
    }
  });
}

function addHabitSubmit(event, setHabits) {
  event.preventDefault();
  window.halfmoon.toggleModal('add-habit-modal');
  const form = event.target;
  fetch('/habits', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    body: new FormData(form),
  }).then((response) => {
    if (response.ok) {
      response.json().then((newHabit) => {
        setHabits((habits) => ([
          ...habits,
          newHabit,
        ]));
      });
    }
  });
  form.reset();
}

function editHabitSubmit(event, setHabits, habitId) {
  event.preventDefault();
  window.halfmoon.toggleModal('edit-habit-modal');
  const form = event.target;
  const formData = new FormData(form);
  const formObject = { id: habitId, action: 'edit' };
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  fetch('/habits', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify(formObject),
  }).then((response) => {
    if (response.ok) {
      response.json()
        .then((json) => {
          setHabits((habits) => (habits.map((habit) => (
            habit.id === json.id ? json : habit
          ))));
        });
    }
  });
  form.reset();
}

function deleteHabit(habitId, setHabits) {
  fetch('/habits', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: habitId,
      action: 'delete',
    }),
  }).then((response) => {
    if (response.ok) {
      setHabits((habits) => habits.filter((habit) => (
        habit.id !== habitId
      )));
      alertNotif('Deleted');
    }
  });
}

export {
  timeRemain,
  markTodo,
  deleteTodo,
  equipAvatar,
  purchaseAvatar,
  alertNotif,
  markHabit,
  addHabitSubmit,
  editHabitSubmit,
  deleteHabit,
};
