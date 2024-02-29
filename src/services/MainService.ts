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

	async getIndex(userId: ObjectId = null, next) {
		let lists,
			sharedLists,
			user;

		if(userId) {
			try {
				user = await this.userModel.getById(userId);	
			} catch (error) {
				return next(new Error.Db.GetUserByIdFailed({ originalError: error }));
			}

			try {
				lists = await this.listModel.fetchAndPopulateLists({ author: userId });
				sharedLists = await this.listModel.fetchAndPopulateLists({ sharedWith: user.nick });	
			} catch (error) {
				return next(new Error.Db.FetchListsFailed({ originalError: error }));
			}
		}  else {
			try {
				lists = await this.listModel.fetchAndPopulateLists();
				sharedLists = null;	
			} catch (error) {
				return next(new Error.Db.FetchListsFailed({ originalError: error }));
			}
		}
		
		return {lists: lists, sharedLists: sharedLists};
	}
}

const mainService = new MainService();
export { mainService };
