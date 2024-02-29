import express from 'express';
import { body } from 'express-validator';
import { itemController } from '../../controllers/todo/ItemController';
import isAuth from '../../middleware/is-auth';

const router = express.Router();

// /todo/item/add => GET
router.get('/add/:listId', isAuth, itemController.getAdd);

// /todo/item/add => POST
router.post('/add', isAuth,
	[
		body('title')
			.isString()
			.isLength({ min: 3 })
			.withMessage('"Title" must contain at least three characters.')
			.trim(),
		body('description', 'Add description up to 400 letters.')
			.optional()
			.isLength( {min: 0, max: 400 })
			.trim()
	]
	,itemController.postAdd);

// /todo/item/delete => POST
router.delete('/delete/:listId/:itemId', isAuth, itemController.deleteDelete);

// /todo/item/set-state => POST
router.post('/set-state', isAuth, itemController.postSetStatus);

export { router as itemRoutes };
