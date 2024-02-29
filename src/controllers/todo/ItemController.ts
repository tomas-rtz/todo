import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { itemService } from '../../services/todo/ItemService';

class ItemController {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getAdd(req: Request, res: Response, next: NextFunction): void {
		const listId = req.params.listId;
		
		res.render('todo/add-item', {
			pageTitle: 'Add Task',
			path: '/todo/add-item',
			listId: listId,
			hasError: false,
			errorMessage: null,
			validationErrors: []
		});
	}

	async postAdd(req: Request, res: Response, next: NextFunction): Promise<void> {
		const {listId, title, deadline, description} = req.body;
		const errors = validationResult(req);
	
		if(!errors.isEmpty()) {
			return res.status(422)
				.render('todo/add-item', {
					path: '/todo/add-item',
					pageTitle: 'Add Task',
					hasError: true,
					item: {
						title, deadline, description
					},
					errorMessage: errors.array()[0].msg,
					validationErrors: errors.array(),
					listId: listId
				});
		}

		
		try {
			await itemService.addItem(req.body, next);
			res.redirect('/');
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async deleteDelete(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			await itemService.deleteItem(req.params, next);
			return res.status(200).json({ message: 'Item succesfully deleted!' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async postSetStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await itemService.setItemStatus(req.body, next);
			res.redirect('/');
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

const itemController = new ItemController();
export { itemController };
