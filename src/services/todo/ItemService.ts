import * as Error from '../../errors';
import ItemModel from '../../models/ItemModel';
import ListModel from '../../models/ListModel';

class ItemService {
	itemModel: ItemModel;
	listModel: ListModel;

	constructor() {
		this.itemModel = new ItemModel();
		this.listModel = new ListModel();
	}

	async addItem({ listId, title, description, deadline }, next) {
		let list;

		try {
			list = await this.listModel.getListById(listId);
		} catch (error) {
			return next(new Error.Db.GetListByIdFailed({ originalError: error }));
		}

		if (!list) {
			return next(new Error.App.ListDoesNotExist());
		}

		let item;
		try {
			item = await this.itemModel.addItem({
				title,
				description,
				deadline,
				list: listId,
			});
		} catch (error) {
			return next(new Error.Db.StoreItemFailed({ originalError: error }));
		}

		try {
			await this.listModel.pushItem(listId, item._id);
		} catch (error) {
			return next(new Error.Db.UpdateListFailed({ originalError: error }));
		}

		return;
	}

	async deleteItem(params, next) {
		const { listId, itemId } = params;
		await this.itemModel.deleteItem(itemId);

		try {
			return await this.listModel.pullItem(listId, itemId);
		} catch (error) {
			return next(new Error.Db.UpdateListFailed({ originalError: error }));
		}
	}

	async setItemStatus({ itemId, itemStatus }, next) {
		const item = await this.itemModel.getItemById(itemId);
		if (!item) {
			return next(new Error.App.ItemDoesNotExist());
		}

		try {
			await this.itemModel.setItemStatus(itemId, itemStatus);
		} catch (error) {
			return next(new Error.Db.UpdateItemStatusFailed({ originalError: error }));
		}

		return;
	}
}

const itemService = new ItemService();
export { itemService };
