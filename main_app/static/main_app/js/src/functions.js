import csrftoken from './csrf'
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// The contents of this file are functions that are not used
// for rendering JSX components. Most of the functions are used
// to communicate with the backend to perform actions like
// marking a todo as completed etc.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Used to pop-up an alert:
function modalAlert(text) {
	alert(text);
}

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
function rewardPopup() {
	let popup = document.querySelector('#complete-popup');
	popup.style.display = 'block';
	// Dismiss popup after 4 seconds:
	setTimeout(() => {popup.style.display = 'none'}, 4000);
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
			response.text().then((text) => modalAlert(text));
		} else {
			fetchStats();
			// Update the todo element:
			response.json().then((json) => {
				setTodo(json);
				if (json.completed) {
					rewardPopup();
				}
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
			setTodoAll((todoAll) => {
				return todoAll.filter((todo) => todo.id !== id)
			});
		} else {
			response.text().then((text) => modalAlert(text));
		}
	});
}


// Used to equip an avatar
function equipAvatar(id) {
	fetch('/equip_avatar/' + id)
		.then(response => {
			if (response.ok) {
				window.location.reload(true);
			} else {
				response.text().then(text => modalAlert(text));
			}
		});
}


// Used to purchase a reward:
function purchaseAvatar(id) {
	fetch('/purchase/' + id)
		.then(response => {
			if (response.ok) {
				window.location.reload(true);
			} else {
				response.text().then(text => modalAlert(text));
			}
		});
}


export {
	timeRemain,
	markTodo,
	deleteTodo,
	equipAvatar,
	purchaseAvatar
};
