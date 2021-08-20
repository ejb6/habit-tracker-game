function TodoItem({todo}) {
	return (
		<div className="item bg-light border-bottom mb-1">
			<button className="btn bg-lightblue" onClick={remove_todo}>
				<i className="bi bi-check-circle"></i>
			</button>
			<div className="py-1 overflow-hide">
				<div>{todo.title}</div>
				<small className="text-secondary">
					{todo.description}
				</small>
			</div>
			<div className="py-1 datetime">
				<small>{time_remain(todo.deadline)}</small>
			</div>
		</div>
	)
}

function AddTodo() {
	return (
		<div className="mb-1 text-center add-item">
			<button className="btn bg-light w-100">
				<i className="bi bi-plus-square"></i>&nbsp;
				Add a Todo
			</button>
		</div>
	)
}


// This is used to calculate the remaining time before a deadline:
function time_remain(deadline_str) {
	let date_now = new Date();
	let date_deadline = new Date(deadline_str);
	// Time difference in days:
	let diff = Math.round((date_deadline - date_now)/(1000*60*60*24));

	// Return value:
	let remain = "";

	// Way past deadline:
	if (diff < -1) {
		remain = -diff + " days overdue";
	// Deadline is not yet near:
	} else if (diff > 1) {
		remain = diff + " days left";
	} else {
		// Less than 24 hours left:
		// Time difference in hours:
		diff = Math.round((date_deadline - date_now)/(1000*60*60));
		if (diff == 0) {
			remain = "Less than 30 mins left"
		}
		else if (diff == 1) {
			remain = "1 hour left";
		} else if (diff > 1) {
			remain = diff + " hours left"
		} else {
			// Less than 1 day overdue:
			remain = "Overdue";
		}
	};
	return remain;
}

function remove_todo() {
	alert("removed")
}

class Todos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {todo_list: []}
	}

	componentDidMount() {
		fetch("/todo").then(response => response.json())
			.then(todo_list => {
				this.setState({todo_list: todo_list});
			});
	}

	render () {
		return (
			<div>
				<AddTodo />
				{this.state.todo_list.map(todo => (
					<TodoItem key = {todo.id} todo = {todo} />
				))}
			</div>
		)
	}
}

ReactDOM.render(<Todos />, document.querySelector("#todos"));
