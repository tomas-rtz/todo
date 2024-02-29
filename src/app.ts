import bodyParser from 'body-parser';
import flash from 'connect-flash';
import MongoDBStore from 'connect-mongodb-session';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express, { MyRequest, NextFunction } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import { connect } from './config/db';
import { logger } from './config/winston';
import { errorController } from './controllers/ErrorController';
import * as Error from './errors';
import UserModel from './models/UserModel';
dotenv.config();

const MongoStore = MongoDBStore(session);
const User = new UserModel();

const MONGODB_URI = process.env.DB_ADDRESS + process.env.DB_NAME;

const app = express();

const store = new MongoStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', './src/views');

import { ObjectId } from 'mongodb';
import { mainRoutes } from './routes/mainRoutes';
import { itemRoutes } from './routes/todo/itemRoutes';
import { listRoutes } from './routes/todo/listRoutes';
import { userRoutes } from './routes/userRoutes';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// FIXME create external declaration
declare module 'express-session' {
	interface SessionData {
		isLoggedIn: boolean;
		user: {
			_id: ObjectId,
			nick: string,
			password: string,
			lists: Array<ObjectId>
		};
	}
}

// TODO create external declaration
declare module 'express' {
	export interface MyRequest extends Request {
		user?: any // TODO
	}
}

app.use((req: MyRequest, res, next) => {
	const sessionData = req.session; 
	if (!sessionData.user) {
		return next();
	}

	User.getById(req.session.user._id)
		.then(user => {
			if(!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(error => {
			next(new Error.App.UserNotFound({originalError: error}));
		});
});

app.use(morgan('combined', { stream: logger.stream })); // logger

app.use(mainRoutes);
app.use(userRoutes);
app.use('/todo/list', listRoutes);
app.use('/todo/item', itemRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

interface TodoError extends Error { // TODO extend error in external declaration ts file
	statusCode?: number;
	originalError?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use( (err: TodoError, req: express.Request, res: express.Response, next: NextFunction) => {
	logger.error(
		`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err} - ${err.stack} - ${err.originalError}`
	);

	res.status(500).render('500', {
		pageTitle: 'Internal Server Error',
		path: '500',
		isAuthenticated: req.session.isLoggedIn
	});
});

connect().then(() => {
	app.listen(process.env.PORT, () => {
		logger.log('info', `App listen on ${process.env.PORT}`);
	});
}).catch(error => {
	logger.log('error', error);
});