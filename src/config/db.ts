import dotenv from 'dotenv';
import mongoose, { ConnectionOptions } from 'mongoose';
import { logger } from '../config/winston';

dotenv.config();

const { Schema } = mongoose;
const dbName = process.env.DB_NAME;
const dbAddress = process.env.DB_ADDRESS;
//const isProduction = process.env.NODE_ENV === 'production';

const uri = `${dbAddress}${dbName}`;

const connectionOptions: ConnectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

async function connect() {
	try {
		await mongoose.connect(uri, connectionOptions);
		logger.log('info', 'Database connected!');
	} catch (error) {
		logger.error('Error connecting to the database:', error);
	}
}

export { Schema, connect, mongoose };
