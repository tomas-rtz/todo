import { TodoError } from './TodoError';


export class App extends TodoError {

	constructor(public errorKey: string, public options?: object, public statusCode?: number) {
		super(errorKey, options);

		this.statusCode = statusCode || 400;
	}
}

export class UserNotFound extends App {
	constructor(public options?: object) {
		
		super('userNotFounError', options);
		
		this.message = 'Provided user is not found anymore.';
	}
}

export class SearchUserFailed extends App {
	constructor(public options?: object) {
		
		super('searchUserFailed', options);
		
		this.message = 'Search user failed.';
	}
}

export class PasswordsNotSame extends App {
	constructor(public options?: object) {
		
		super('passwordsNotSame', options);
		
		this.message = 'Passwords are not the same.';
	}
}

export class UserAlreadyExists extends App {
	constructor(public options?: object) {
		
		super('userAlreadyExists', options);
		
		this.message = 'User already exists.';
	}
}


export class ListDoesNotExist extends App {
	constructor(public options?: object) {
		
		super('listDoesNotExist', options);
		
		this.message = 'List does not exist.';
	}
}

export class ItemDoesNotExist extends App {
	constructor(public options?: object) {
		
		super('itemDoesNotExist', options);
		
		this.message = 'Item does not exist.';
	}
}

