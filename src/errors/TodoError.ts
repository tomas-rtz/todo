interface RequiredProperties {
	errorKey: string
}

export class TodoError extends Error implements RequiredProperties {
	constructor(public errorKey: string, public options?: object) {
		super();

		if (options && Object.keys(options).length > 0) {
			for (const [key, value] of Object.entries(options)) {
				this[key] = value;
			}
		}
	}
}