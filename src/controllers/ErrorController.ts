import { NextFunction, Request, Response } from 'express';

class ErrorController {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	get404(req: Request, res: Response, next: NextFunction): void {
		res.status(404).render('404', {
			pageTitle: 'Page Not Found',
			path: '/404',
			isAuthenticated: req.session.isLoggedIn
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	get500(req: Request, res: Response, next: NextFunction): void {
		res.status(500).render('500', {
			pageTitle: 'Error',
			path: '/500',
			isAuthenticated: req.session.isLoggedIn
		});
	}
}

const errorController = new ErrorController();
export { errorController };
