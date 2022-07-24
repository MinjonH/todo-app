const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('./models/user.model.js');
const Todo = require('./models/todo.model.js');

require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);

//---------- AUTHENTICATION ROUTES ----------

app.get('/', (req, res) => {
	res.send('ok');
});

//Get user
app.get('/user', (req, res) => {
	if (!req.cookies.token) {
		return res.json({});
	}
	const payload = jwt.verify(req.cookies.token, process.env.JWT_KEY);
	User.findById(payload.id).then((userInfo) => {
		if (!userInfo) {
			return res.json({});
		}
		res.json({ id: userInfo._id, email: userInfo.email });
	});
});

//New user registration
app.post('/register', (req, res) => {
	const { email, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = new User({ password: hashedPassword, email });
	user.save().then((userInfo) => {
		jwt.sign(
			{ id: userInfo._id, email: userInfo.email },
			process.env.JWT_KEY,
			(err, token) => {
				if (err) {
					console.log(err);
					res.sendStatus(500);
				} else {
					res
						.cookie('token', token)
						.json({ id: userInfo._id, email: userInfo.email });
				}
			}
		);
	});
});

//Existing user login
app.post('/login', (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).then((userInfo) => {
		if (!userInfo) {
			return res.sendStatus(401);
		}
		const passOk = bcrypt.compareSync(password, userInfo.password);
		if (passOk) {
			jwt.sign({ id: userInfo._id, email }, process.env.JWT_KEY, (err, token) => {
				if (err) {
					console.log(err);
					res.sendStatus(500);
				} else {
					res
						.cookie('token', token)
						.json({ id: userInfo._id, email: userInfo.email });
				}
			});
		} else {
			res.sendStatus(401);
		}
	});
});

//Let a user log out
app.post('/logout', (req, res) => {
	res.cookie('token', '').send();
});

//---------- TODO ROUTES ----------

//Returns todos currently saved by user
app.get('/todos', (req, res) => {
	const payload = jwt.verify(req.cookies.token, process.env.JWT_KEY);
	Todo.where({ user: new mongoose.Types.ObjectId(payload.id) }).find(
		(err, todos) => {
			res.json(todos);
		}
	);
});

//Create new todos
app.put('/todos', (req, res) => {
	const payload = jwt.verify(req.cookies.token, process.env.JWT_KEY);
	const todo = new Todo({
		text: req.body.text,
		done: false,
		user: new mongoose.Types.ObjectId(payload.id),
	});
	todo.save().then((todo) => {
		res.json(todo);
	});
});

//Update todos
app.post('/todos', (req, res) => {
	const payload = jwt.verify(req.cookies.token, process.env.JWT_KEY);
	Todo.updateOne(
		{
			_id: new mongoose.Types.ObjectId(req.body.id),
			user: new mongoose.Types.ObjectId(payload.id),
		},
		{
			done: req.body.done,
		}
	).then(() => {
		res.sendStatus(200);
	});
});

//---------- CONNECTION TO DATABASE ----------

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@minjon-holtzhausen.v3mvnyk.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on('error', function () {
	console.log('Could not connect to the database. Exiting now...');
	process.exit();
});
mongoose.connection.once('open', function () {
	console.log('Successfully connected to the database');
});

const port = process.env.PORT || 3001;
app.listen(port, console.log('Server is listening on ', port));
