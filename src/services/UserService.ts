import bcrypt from 'bcryptjs';
import * as Error from '../errors';
import UserModel from '../models/UserModel';

class UserService {
	userModel: UserModel;

	constructor() {
		this.userModel = new UserModel();
	}

	async login(user, session, next) {
		session.isLoggedIn = true;
		session.user = user;
		session.save((error: Error) => {
			if (error) return next(new Error.Db.StoreUserFailed({originalError: error }));
		});

		return;
	}

	async signUp({nick, password, confirmPassword}, next) {
		const userDoc = await this.userModel.getUserByNick(nick);
		if (userDoc) {
			return next(new Error.App.UserAlreadyExists());
		}

		if (password !== confirmPassword) {
			return next(new Error.App.PasswordsNotSame());
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		await this.userModel.addUser({
			nick: nick,
			password: hashedPassword,
			lists: []
		});

		return;
	}

	async searchUser(searchTerm, next) {
		try {
			return await this.userModel.searchUsers(searchTerm);
		} catch (error) {
			return next(new Error.App.SearchUserFailed());
		}
	}
}

const userService = new UserService();
export { userService as userService };
