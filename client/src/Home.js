import { useContext, useEffect, useState } from 'react';
import UserContext from './UserContext';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function Home() {
	const userInfo = useContext(UserContext);
	const [inputVal, setInputVal] = useState('');
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		axios
			.get(`${API_BASE}/todos`, { withCredentials: true })
			.then((response) => {
				setTodos(response.data);
			});
	}, []);

	if (!userInfo.email) {
		return 'Please login to view this page';
	}

	const addTodo = (e) => {
		e.preventDefault();
		axios
			.put(`${API_BASE}/todos`, { text: inputVal }, { withCredentials: true })
			.then((response) => {
				setTodos([...todos, response.data]);
				setInputVal('');
			});
	};

	const updateTodo = (todo) => {
		const data = { id: todo._id, done: !todo.done };
		axios
			.post(`${API_BASE}/todos`, data, { withCredentials: true })
			.then(() => {
				const newTodos = todos.map((t) => {
					if (t._id === todo._id) {
						t.done = !t.done;
					}
					return t;
				});
				setTodos([...newTodos]);
			});
	};

	return (
		<div>
			<form onSubmit={(e) => addTodo(e)}>
				<h1>Todo List</h1>
				<input
					placeholder={'Add something to do'}
					value={inputVal}
					onChange={(e) => setInputVal(e.target.value)}
				/>
			</form>
			<ul>
				{todos.map((todo) => (
					<li>
						<input
							type={'checkbox'}
							checked={todo.done}
							onClick={() => updateTodo(todo)}
						/>
						{todo.done ? <del>{todo.text}</del> : todo.text}
					</li>
				))}
			</ul>
		</div>
	);
}

export default Home;
