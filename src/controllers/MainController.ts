import { MyRequest, NextFunction, Response } from 'express';
import { mainService } from '../services/MainService';

// FIXME MyRequest make global       
class MainController {
	async getIndex(req: MyRequest, res: Response, next: NextFunction): Promise<void> {
		const userId = req?.user?._id;

		const data = await mainService.getIndex(userId || null, next);

		if(userId) {
			res.render('todo/lists', {
				lists: data.lists,
				sharedLists: data.sharedLists,
				pageTitle: 'ToDo List',
				path: '/lists',
				list: {
					title: '',
					description: '',
					deadline: ''  
				},
				errorMessage: ''
			});
		} else {
			res.render('todo/lists', {
				lists: data.lists,
				pageTitle: 'ToDo List',
				path: '/lists',
				errorMessage: ''
			});
		}
    
	}
}

const mainController = new MainController();
export { mainController };
