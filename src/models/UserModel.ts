import * as db from '../config/db';

interface UserDocument extends db.mongoose.Document {
	nick: string,
	password: string,
	lists: Array<typeof db.Schema.Types.ObjectId>,
}

const Schema = db.Schema<UserDocument>;

const userSchema = new Schema({
	nick: { 
		type: String, 
		required: true 
	},
	password: {
		type: String,
		required: true
	},
	lists: [
		{ 
			type: db.Schema.Types.ObjectId, 
			ref: 'List' 
		}
	],
}, { collection: 'users' });

//export default class UserModel {
class UserModel {
	model: db.mongoose.Model<UserDocument>;

	constructor() {
		this.model = db.mongoose.model('User', userSchema);
	}

	async addUser(user) {
		return await this.model.create(user);
	}

	async getUserByNick(nick) {
		return await this.model.findOne({ nick });
	}

	async getById(id) {
		return await this.model.findOne({ _id: id });
	}

	async pushList(userId, listId) {
		return await this.model.findByIdAndUpdate(userId, { $push: { lists: listId } });
	}

	async pullList(userId, listId) {
		return await this.model.findByIdAndUpdate(userId, { $pull: { lists: listId } });
	}

	async fetchUsers(filter) {
		return await this.model.find(filter);
	}

	async searchUsers(searchTerm) {
		const query = { nick: { $regex: searchTerm, $options: 'i' } };
		const result = await this.model.find(query).limit(10).select('nick');
		return result;
	}
}

export default UserModel;