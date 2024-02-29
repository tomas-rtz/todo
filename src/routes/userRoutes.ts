import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/UserController';
import UserModel from '../models/UserModel';
const router = express.Router();

router.get('/login', userController.getLogin);

router.get('/signup', userController.getSignup);

router.post('/login', 
	[
		body('nick')
			.isLength({ min: 3 })
			.withMessage('"Nick" must contain at least three characters.')
			.trim(),
		body('password', 'Password has to be valid.')
			.isLength({ min: 4 })
			.isAlphanumeric()
			.trim()
	],
	userController.postLogin);

router.post('/signup', 
	[	
		body('nick')
			.isLength({ min: 3 })
			.withMessage('"Nick" must contain at least three characters.')
			.custom((value) => {
				const userModel = new UserModel();
				return userModel.getUserByNick(value)
					.then(user => {
						if (user) {
							return Promise.reject('User with provided "Nick" exists already, please pick a different one.');
						}
					});
			})
			.trim(),
		body('password', '"Password" must contain at least four characters and include letters and numbers.')
			.isLength({ min: 4 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.custom((value, {req}) => {
				if(value !== req.body.password) {
					throw new Error('Passwords have to match.');
				}
				return true;
			})
			.trim()
	],
	userController.postSignup
);

router.post('/logout', userController.postLogout);

router.get('/user/search', userController.getSearch);

export { router as userRoutes };
