import { MyRequest, NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../../models/UserModel';
import { listService } from '../../services/todo/ListService';

class ListController {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getAdd(req: Request, res: Response, next: NextFunction): void {
		res.render('todo/add-list', {
			pageTitle: 'Add List',
			path: '/todo/list/add',
			hasError: false,
			errorMessage: null,
			validationErrors: []
		});

	}

	async postAdd(req: MyRequest, res: Response, next: NextFunction): Promise<void> {
		const {listId, title, deadline, description} = req.body;
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(422)
				.render('todo/add-list', {
					path: '/todo/list/add',
					pageTitle: 'Add List',
					hasError: true,
					list: {
						title, deadline, description
					},
					errorMessage: errors.array()[0].msg,
					validationErrors: errors.array(),
					_id: listId
				});
		}

		try {
			await listService.addList(req.user, req.body, next);
			res.redirect('/');
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	// REST endpoints
	async deleteDelete(req: MyRequest, res: Response, next: NextFunction): Promise<Response> {
		try {
			await listService.deleteList(req.user, req.params, next);
			return res.status(200).json({ message: 'List successfully deleted!' });
		} catch (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	async getShare(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const { listId, nick } = req.query;

		const userModel = new UserModel();
		const user = await userModel.getUserByNick(nick);

		if (!user) {
			return res.status(500).json({ message: 'User not found!' });
		}

		try {
			await listService.shareList(listId, nick, next);
			return res.status(200).json({ message: 'Successfully shared!' });
		} catch (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}

const listController = new ListController();
export { listController };
