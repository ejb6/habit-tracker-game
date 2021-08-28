import Todos from './Todos';
import React from 'react';
import ReactDOM from 'react-dom';
import {EditTodoForm} from './Forms';


// Render the List of Todos:
ReactDOM.render(<Todos />, document.querySelector('#todo-items'));
// Render the form for editing a Todo:
ReactDOM.render(<EditTodoForm />, document.querySelector('#edit-todo'));

