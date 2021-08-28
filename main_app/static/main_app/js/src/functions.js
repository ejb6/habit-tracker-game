import csrftoken from './csrf'
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// The contents of this file are functions that are not used
// for rendering components. Most of the functions are used
// to communicate with the backend to perform actions like
// marking a todo as completed etc.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
			response.text().then((text) => alert(text));
		} else {
			alert('Success!');
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
			setTodoAll((todoAll) => {
				return todoAll.filter((todo) => todo.id !== id)
			});
		} else {
			response.text().then((text) => alert(text));
		}
	});
}

export {markTodo, deleteTodo};
