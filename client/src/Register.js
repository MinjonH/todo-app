import { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
import { Navigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [navigate, setNavigate] = useState(false);

	const user = useContext(UserContext);

	const registerUser = (e) => {
		e.preventDefault();

		const data = { email, password };
		axios
			.post(`${API_BASE}/register`, data, { withCredentials: true })
			.then((response) => {
				user.setEmail(response.data.email);
				setEmail('');
				setPassword('');
				setNavigate(true);
			});
	};

	if (navigate) {
		return <Navigate to={'/'} />;
	}

	return (
		<form action='' onSubmit={(e) => registerUser(e)}>
			<h1>Register</h1>
			<input
				type='email'
				placeholder='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<br />
			<input
				type='password'
				placeholder='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<br />
			<button type='submit'>Register</button>
		</form>
	);
}

export default Register;
