import { ObjectId } from 'mongodb';
import * as Error from '../errors';
import ItemModel from '../models/ItemModel';
import ListModel from '../models/ListModel';
import UserModel from '../models/UserModel';

class MainService {
	itemModel: ItemModel;
	listModel: ListModel;
	userModel: UserModel;

	constructor() {
		this.itemModel = new ItemModel();
		this.listModel = new ListModel();
		this.userModel = new UserModel();
	}

	async getIndex(userId: ObjectId, next) {
		let ownLists,
			sharedLists,
			user;

		try {
			user = await this.userModel.getById(userId);	
		} catch (error) {
			return next(new Error.Db.GetUserByIdFailed({ originalError: error }));
		}
		

		try {
			ownLists = await this.listModel.fetchLists({ author: userId });
			sharedLists = await this.listModel.fetchLists({ sharedWith: user.nick });	
		} catch (error) {
			return next(new Error.Db.FetchListsFailed({ originalError: error }));
		}
		
		return {lists: ownLists, sharedLists: sharedLists};
	}
}

const mainService = new MainService();
export { mainService };
