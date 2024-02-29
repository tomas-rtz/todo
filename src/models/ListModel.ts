import * as db from '../config/db';

interface ListDocument extends db.mongoose.Document {
	title: string,
	deadline: Date,
	description: string,
	author: typeof db.Schema.Types.ObjectId,
	sharedWith: Array<string>,
	items: Array<typeof db.Schema.Types.ObjectId>,
}

const Schema = db.Schema<ListDocument>;

const listSchema = new Schema({
	title: { 
		type: String, 
		required: true 
	},
	deadline: {
		type: Date,
	},
	description: { 
		type: String, 
	},
	author: { 
		type: Schema.Types.ObjectId, 
		ref: 'User', 
		required: true 
	},
	sharedWith: [
		{ 
			type: String, 
			ref: 'User' 
		}
	],
	items: [
		{ 
			type: Schema.Types.ObjectId, 
			ref: 'Item' 
		}
	],
}, { timestamps: true, collection: 'lists' });

class ListModel {
	model: db.mongoose.Model<ListDocument>;

	constructor() {
		this.model = db.mongoose.model('lIST', listSchema);
	}

	async addList(list) {
		return await this.model.create(list);
	}

	async getListById(listId) {
		return await this.model.findById(listId);
	}

	async pushItem(listId, itemId) {
		await this.model.findByIdAndUpdate(listId, { $push: { items: itemId } });
	}

	async pullItem(listId, itemId) {
		await this.model.findByIdAndUpdate(listId, { $pull: { items: itemId } });
	}

	async deleteList(listId) {
		await this.model.findByIdAndRemove(listId);
	}

	async shareList(nick, listId) {
		await this.model.findByIdAndUpdate(listId, { $addToSet: { sharedWith: nick } });
	}

	async fetchLists(filter) {
		return await this.model.find(filter)
			.populate('items')
			.populate('author', 'nick')
			.sort({ createdAt: -1 });
	}
  
}

export default ListModel;