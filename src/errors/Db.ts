import { TodoError } from './TodoError';

interface RequiredOptions {
	options: {
		originalError: Error
	}
}

export class Db extends TodoError implements RequiredOptions {
	statusCode: number;
	
	constructor(
		public errorKey: string,
		public options: {
			originalError: Error
		},
	) {
		super(errorKey, options);
		this.statusCode = 500;
	}
}

export class DeleteAllBuddiesFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('deleteAllBuddiesFailed', options);

		this.message = 'Deleting all buddies from database failed.';
	}
}

export class StoreItemFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('storeItemFailed', options);

		this.message = 'Adding item to database failed.';
	}
}

export class StoreUserFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('storeUserFailed', options);

		this.message = 'Adding user to database failed.';
	}
}

export class StoreListFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('storeListFailed', options);

		this.message = 'Adding list to database failed.';
	}
}

export class UpdateListFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('updateListFailed', options);

		this.message = 'Updating list failed.';
	}
}

export class FetchListsFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('fetchListsFailed', options);

		this.message = 'Fetching list failed.';
	}
}

export class UpdateUserListsFieldFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('updateUserListsFieldFailed', options);

		this.message = 'Updating user lists field failed.';
	}
}

export class DeleteListFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('deleteListFailed', options);

		this.message = 'Deleting list failed.';
	}
}


export class DeleteItemFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('deleteItemFailed', options);

		this.message = 'Deleting item failed.';
	}
}

export class UpdateItemStatusFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('updateItemStatusFailed', options);

		this.message = 'Updating of item status failed.';
	}
}


export class GetListByIdFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('getListByIdFailed', options);

		this.message = 'Getting list by id failed.';
	}
}

export class GetUserByIdFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('getUserByIdFailed', options);

		this.message = 'Getting User by id failed.';
	}
}

export class ShareListFailed extends Db {
	errorKey: string;

	constructor(options: {originalError: Error}) {
		super('shareListFailed', options);

		this.message = 'Sharing list failed.';
	}
}
