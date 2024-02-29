import express from 'express';
import { body } from 'express-validator';
import { listController } from '../../controllers/todo/ListController';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// /todo/list/add => GET
router.get('/add', isAuth, listController.getAdd);

// /todo/list/add => POST
router.post('/add', isAuth,
	[
		body('title')
			.isString()
			.isLength({ min: 3 })
			.withMessage('"Title" must contain at least one characters.')
			.trim(),
		body('description', 'Add description up to 400 letters.')
			.optional()
			.isLength( {min: 0, max: 400 })
			.trim()
	]
	,listController.postAdd);

// /todo/list/delete => DELETE
router.delete('/delete/:listId', isAuth, listController.deleteDelete);

// /todo/list/share => GET
router.get('/share/', isAuth, listController.getShare);

export { router as listRoutes };



