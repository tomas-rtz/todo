// import { AuthService } from '../services/AuthService';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../models/UserModel';
import { userService } from '../services/UserService';

class UserController {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getLogin(req: Request, res: Response, next: NextFunction): void {
		const messageArr = req.flash('error');
		const message = (messageArr.length > 0) ? messageArr[0] : null;
		
		res.render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: message,
			originalInput: {
				nick: '',
				password: ''
			},
			validationErrors: []
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getSignup(req: Request, res: Response, next: NextFunction): void {
		const messageArr = req.flash('error');
		const message = (messageArr.length > 0) ? messageArr[0] : null;
		
		res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: message,
			originalInput: {
				nick: '',
				password: '',
				confirmPassword: ''
			},
			validationErrors: []
		});
	}

	async postLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
		const {nick, password} = req.body;
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(422)
				.render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					errorMessage: errors.array()[0].msg,
					originalInput: {
						nick, password
					},
					validationErrors: errors.array()
				});
		}

		const userModel = new UserModel();
		const user = await userModel.getUserByNick(nick);
		
		if (!user) {
			return res.status(422)
				.render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					errorMessage: 'Invalid user "nick" or "password"',
					originalInput: {
						nick, password
					},
					validationErrors: []
				});
		}
      
		const doMatch = await bcrypt.compare(password, user.password);
        
		if (!doMatch) {
			return res.status(422)
				.render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					errorMessage: 'Invalid user "nick" or "password"',
					originalInput: {
						nick, password
					},
					validationErrors: []
				});
		}

		try {
			await userService.login(user, req.session, next);
			res.redirect('/');
		} catch (err) {
			res.redirect('/login');
		}

		return;
	}

	async postSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { nick, password, confirmPassword } = req.body;

		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			return res.status(422)
				.render('auth/signup', {
					path: '/signup',
					pageTitle: 'Signup',
					errorMessage: errors.array()[0].msg,
					originalInput: { nick, password, confirmPassword },
					validationErrors: errors.array()
				});
		}

		try {
			await userService.signUp(req.body, next);
			res.redirect('/login');
		} catch (err) {
			res.redirect('/login');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	postLogout(req: Request, res: Response, next: NextFunction): void {
		req.session.destroy(() => {
			res.redirect('/');
		});
	}

	async getSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
		const searchTerm = req.query.q.toString().toLowerCase();
 
		try {
			const filteredUsers = await userService.searchUser(searchTerm, next);
			res.json(filteredUsers);
		} catch (err) {
			throw new Error('Search user failed.');
		}
	}
}

const userController = new UserController();
export { userController };

