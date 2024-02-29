import { MyRequest, NextFunction, Response } from 'express';
import { mainService } from '../services/MainService';

// FIXME MyRequest make global       
class MainController {
	async getIndex(req: MyRequest, res: Response, next: NextFunction): Promise<void> {
		
		if(req.user) {
			const data = await mainService.getIndex(req.user._id, next);
    
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
			res.render('todo', {
				pageTitle: 'ToDo List',
				path: '/index'
			});
		}
    
	}
}

const mainController = new MainController();
export { mainController };
