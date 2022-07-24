import { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
import { Navigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState(false);
	const [navigate, setNavigate] = useState(false);

	const user = useContext(UserContext);

	const loginUser = (e) => {
		e.preventDefault();

		const data = { email, password };
		axios
			.post(`${API_BASE}/login`, data, { withCredentials: true })
			.then((response) => {
				user.setEmail(response.data.email);
				setEmail('');
				setPassword('');
				setLoginError(false);
				setNavigate(true);
			})
			.catch(() => {
				setLoginError(true);
			});
	};

	if (navigate) {
		return <Navigate to={'/'} />;
	}

	return (
		<form action='' onSubmit={(e) => loginUser(e)}>
			{loginError && <div>Incorrect email or password</div>}
			<h1>Login</h1>
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
			<button type='submit'>LOGIN</button>
		</form>
	);
}

export default Login;
