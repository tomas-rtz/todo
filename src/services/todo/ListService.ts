import * as Error from '../../errors';
import ItemModel from '../../models/ItemModel';
import ListModel from '../../models/ListModel';
import UserModel from '../../models/UserModel';

class ListService {
	itemModel: ItemModel;
	listModel: ListModel;
	userModel: UserModel;

	constructor() {
		this.itemModel = new ItemModel();
		this.listModel = new ListModel();
		this.userModel = new UserModel();
	}

	async addList(user,{title, description, deadline}, next) {
		let newList;
		try {
			newList = await this.listModel.addList({
				title,
				deadline,
				description,
				author: user,
			});
		} catch (error) {
			return next(new Error.Db.StoreListFailed({ originalError: error }));
		}

		try {
			await this.userModel.pushList(user._id, newList._id);			
		} catch (error) {
			return next(new Error.Db.UpdateUserListsFieldFailed({ originalError: error }));
		}
	
		return;
	}

	async deleteList(user, params, next) {
		const { listId } = params;

		try {
			await this.listModel.deleteList(listId);
		} catch (error) {
			return next(new Error.Db.DeleteListFailed({ originalError: error }));
		}

		try {
			await this.itemModel.deleteItemsByListId(listId);
		} catch (error) {
			return next(new Error.Db.DeleteItemFailed({ originalError: error }));
		}

		try {
			await this.userModel.pullList(user._id, listId);
		} catch (error) {
			return next(new Error.Db.UpdateUserListsFieldFailed({ originalError: error }));
		}

		return;
	}

	async shareList(listId, nick, next) {
		let list;

		try {
			list = await this.listModel.getListById(listId);
		} catch (error) {
			return next(new Error.Db.GetListByIdFailed({ originalError: error }));
		}

		if (!list) {
			return next(new Error.App.ListDoesNotExist());
		}

		try {
			await this.listModel.shareList(nick, listId);
		} catch (error) {
			return next(new Error.Db.ShareListFailed({ originalError: error }));
		}

		return;
	}
}

const listService = new ListService();
export { listService };
