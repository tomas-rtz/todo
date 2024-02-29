
import * as db from '../config/db';

interface ItemDocument extends db.mongoose.Document {
  title: string,
  status: string,
  deadline: Date,
  description: string,
  list: typeof db.Schema.Types.ObjectId,
}

const Schema = db.Schema<ItemDocument>;

const itemSchema = new Schema({
	title: { 
		type: String, 
		required: true 
	},
	status: { 
		type: String, 
		enum: ['active', 'done', 'excluded'], 
		default: 'active' 
	},
	deadline: {
		type: Date,
	},
	description: {
		type: String, 
	},
	list: { 
		type: Schema.Types.ObjectId, 
		ref: 'List', 
		required: true 
	},
}, { timestamps: true, collection: 'items' });

class ItemModel {
	model: db.mongoose.Model<ItemDocument>;

	constructor() {
		this.model = db.mongoose.model('Item', itemSchema);
	}

	async addItem(item) {
		return await this.model.create(item);
	}

	async getItemById(itemId) {
		return await this.model.findById(itemId);
	}

	async deleteItem(itemId) {
		await this.model.findByIdAndRemove(itemId);
	}

	async deleteItemsByListId(listId) {
		await this.model.deleteMany({ list: listId });
	}

	async setItemStatus(itemId, status) {
		await this.model.findByIdAndUpdate(itemId, { status }, { new: true });
	}
}

export default ItemModel;