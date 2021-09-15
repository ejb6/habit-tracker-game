import csrftoken from './csrf';
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// The contents of this file are functions that are not used
// for rendering JSX components. Most of the functions are used
// to communicate with the backend to perform actions like
// marking a todo as completed etc. This is created for abstraction.
// Other functions like showing alerts are also included.
// To navigate this file easily, go to the end of this file and search
// for the functions that are on the export list using your editor/IDE.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// The date now at 12 midnight
const DATE_NOW = new Date();
DATE_NOW.setHours(0, 0, 0, 0);

// This is used to calculate the remaining time before a deadline:
function timeRemain(deadlineStr) {
  const dateTimeNow = new Date();
  const dateDeadline = new Date(deadlineStr);
  // Time difference in days:
  let diff = Math.round((dateDeadline - dateTimeNow) / (1000 * 60 * 60 * 24));
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
    diff = Math.round((dateDeadline - dateTimeNow) / (1000 * 60 * 60));
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
// Shows a small popup from the bottom:
function alertPopups(text) {
  const popup = document.querySelector('#alert-popup');
  popup.children[0].innerHTML = text;
  popup.style.display = 'block';
  // Dismiss popup after 4 seconds:
  setTimeout(() => { popup.style.display = 'none'; }, 5000);
}

// Shows a modal for alerts:
function alertModal(textList) {
  window.halfmoon.toggleModal('alert-modal');
  const alertList = document.querySelector('#alert-list');
  alertList.innerHTML = '';
  textList.forEach((text) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = text;
    alertList.appendChild(listItem);
  });
}

function resetHabitStreak(habitId) {
  fetch('/habits', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: habitId,
      action: 'reset',
    }),
  }).then((response) => {
    if (!response.ok) {
      alertPopups('Something is wrong');
    }
  });
}

// Used for calculating the health deductions for overdue todos
function todoDeduct(deadlineString, lastDeduct) {
  // 'todo' is an object fetched from django
  // Health is only deducted once per day
  // 'lastDeduct' is the date when the health was last deducted
  const deadline = new Date(deadlineString);
  deadline.setHours(0, 0, 0, 0);
  if (deadline >= DATE_NOW || lastDeduct.getTime() === DATE_NOW.getTime()) {
    return 0;
  }
  const refDate = deadline > lastDeduct ? deadline : lastDeduct;
  const returnVal = (DATE_NOW - refDate) / (24 * 3600 * 1000);
  return Math.round(returnVal);
}

// Similar to the previous function
// Used for calculating the health deductions for missed habits/dailies:
// Also used for calculating the exp gain for bad habits by avoiding them:
function dailyHabitPoints(lastCompletedString, dateCreated, lastDeduct) {
  // 'lastDeduct' is the date when the health was last deducted
  const lastCompleted = new Date(lastCompletedString);
  lastCompleted.setHours(0, 0, 0, 0);
  const yesterday = new Date(DATE_NOW.getDate() - 1);
  if (
    dateCreated.getTime() === DATE_NOW.getTime()
    || lastDeduct.getTime() === DATE_NOW.getTime()
    || lastCompleted >= yesterday
  ) {
    return 0;
  }
  // Reference Date:
  // Choose the most recent date among the three:
  const refDate = new Date(Math.max(lastCompleted, dateCreated, lastDeduct));
  // Calculate the number of days between today and the reference date:
  const returnVal = (DATE_NOW - refDate) / (24 * 3600 * 1000);
  return Math.round(returnVal);
}

// The following funciton is run once per day once the user logs in.
// This is used to calculate HP after deduction for missed tasks
async function calculateNewStats(fetchStats) {
  const { lastDeductString } = await fetch('/check_missed/last_deduct')
    .then((response) => response.json());
  const lastDeduct = new Date(lastDeductString);
  lastDeduct.setHours(0, 0, 0, 0);
  let hpDeductCount = 0;
  let expGainCount = 0;

  if (lastDeduct.getTime() === DATE_NOW.getTime()) {
    fetchStats();
    return;
  }

  const todos = await fetch('check_missed/todos')
    .then((response) => response.json());
  todos.forEach((deadlineString) => {
    hpDeductCount += todoDeduct(deadlineString, lastDeduct);
  });

  const goodHabits = await fetch('check_missed/good_habits')
    .then((response) => response.json());
  goodHabits.forEach((habit) => {
    const dateCreated = new Date(habit.created);
    dateCreated.setHours(0, 0, 0, 0);
    const deduct = dailyHabitPoints(habit.lastMarked, dateCreated, lastDeduct);
    if (deduct > 0) {
      resetHabitStreak(habit.id);
    }
    hpDeductCount += deduct;
  });

  const badHabits = await fetch('check_missed/bad_habits')
    .then((response) => response.json());
  badHabits.forEach((habit) => {
    const dateCreated = new Date(habit.created);
    dateCreated.setHours(0, 0, 0, 0);
    const gain = dailyHabitPoints(habit.lastMarked, dateCreated, lastDeduct);
    if (gain > 0) {
      resetHabitStreak(habit.id);
    }
    expGainCount += gain;
  });

  const dailies = await fetch('check_missed/dailies')
    .then((response) => response.json());
  dailies.forEach((daily) => {
    const dateCreated = new Date(daily.created);
    dateCreated.setHours(0, 0, 0, 0);
    hpDeductCount += dailyHabitPoints(daily.lastCompleted, dateCreated, lastDeduct);
  });
  const alertTexts = [];
  if (hpDeductCount) {
    alertTexts.push(`You lost ${hpDeductCount * 3} HP. Make sure
      to complete your good habits and daily tasks everyday.`);
  }
  if (expGainCount) {
    alertTexts.push(`You gained ${expGainCount * 3} EXP.
      Avoid relapsing to your bad habits to keep gaining.`);
  }
  if (alertTexts) {
    alertModal(alertTexts);
  }
  fetch('/check_missed/deduct', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({ hpDeductCount, expGainCount }),
  }).then(fetchStats());
}

// Used to mark/unmark a todo as completed:
function markTodo(action, todoId, setTodos, fetchStats) {
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
      response.text().then((text) => alertPopups(text));
    } else {
      fetchStats();
      // Update the todo element:
      response.json().then((json) => {
        setTodos((todos) => todos.map(
          (todo) => (todo.id === todoId ? json : todo),
        ));
      });
    }
  });
}

// Used to delete a Todo
function deleteTodo(id, setTodos) {
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
      setTodos((todoAll) => todoAll.filter((todo) => todo.id !== id));
    } else {
      response.text().then((text) => alertPopups(text));
    }
  });
}

// Used for handling form submission for adding a Todo
function addTodoSubmit(event, setTodos) {
  event.preventDefault();
  const formElement = event.target;
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
        setTodos((todoAll) => [...todoAll, newTodo]);
      });
      alertPopups('Todo added');
    } else {
      alertPopups('Something is wrong');
    }
  });
  formElement.reset();
}

// This function handles submission for editing Todos
function editTodoSubmit(event, todoId, setTodos) {
  event.preventDefault();
  // Handle edit form submission:
  const form = event.target;
  const formData = new FormData(form);
  const deadlineDate = new Date(formData.get('deadline'));
  formData.set('deadline', deadlineDate.toISOString());
  // Used to tell Django that the 'action' is to edit a Todo:
  const dataObject = { action: 'edit', id: todoId };
  formData.forEach((value, key) => {
    dataObject[key] = value;
  });
  fetch('/todos', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify(dataObject),
  }).then((response) => {
    if (!response.ok) {
      response.text().then((text) => alertPopups(text));
    } else {
      response.json().then((json) => setTodos(
        (todos) => todos.map(
          (todo) => (todo.id === todoId ? json : todo),
        ),
      ));
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
        response.text().then((text) => alertPopups(text));
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
        response.text().then((text) => alertPopups(text));
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
      alertPopups('Habit added');
    } else {
      alertPopups('Failed to create a task.');
    }
  });
  form.reset();
}

function editHabitSubmit(event, setHabits, habitId) {
  event.preventDefault();
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
      alertPopups('Deleted');
    }
  });
}

function addDailySubmit(event, setDailies) {
  event.preventDefault();
  const form = event.target;
  fetch('/dailies', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    body: new FormData(form),
  }).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        alertPopups(json.error);
      } else {
        setDailies((dailies) => [
          ...dailies, json,
        ]);
      }
    });
  form.reset();
}

function editDailySubmit(event, setDailies, dailyId) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const formObject = {
    action: 'edit',
    id: dailyId,
  };
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  fetch('/dailies', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify(formObject),
  }).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        alertPopups(json.error);
      } else {
        setDailies((dailies) => (
          dailies.map((daily) => (
            daily.id === dailyId ? json : daily
          ))
        ));
      }
    });
  form.reset();
}

function deleteDaily(dailyId, setDailies) {
  fetch('/dailies', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: dailyId,
      action: 'delete',
    }),
  }).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        alertPopups(json.error);
      } else {
        setDailies((dailies) => dailies.filter(
          (daily) => daily.id !== dailyId,
        ));
        alertPopups(json.message);
      }
    });
}

function markDaily(dailyId, action, setDailies, fetchStats) {
  fetch('/dailies', {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrftoken },
    body: JSON.stringify({
      id: dailyId,
      action,
    }),
  }).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        alertPopups(json.error);
      } else {
        setDailies((dailies) => (
          dailies.map((daily) => (
            daily.id === dailyId ? json : daily
          ))
        ));
        fetchStats();
      }
    });
}

function dailyIsCompleted(dailyItem) {
  if (dailyItem.lastCompleted == null) {
    return false;
  }
  const lastCompleted = new Date(dailyItem.lastCompleted);
  const today = (new Date()).toDateString();
  if (today === lastCompleted.toDateString()) {
    return true;
  }
  return false;
}

export {
  timeRemain,
  calculateNewStats,
  markTodo,
  deleteTodo,
  addTodoSubmit,
  editTodoSubmit,
  equipAvatar,
  purchaseAvatar,
  alertPopups,
  markHabit,
  addHabitSubmit,
  editHabitSubmit,
  deleteHabit,
  addDailySubmit,
  editDailySubmit,
  markDaily,
  deleteDaily,
  dailyIsCompleted,
};
