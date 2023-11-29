import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function BaseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const clonedRequest = req.clone({
        url: `http://localhost:5001/${req.url}`,
    });
    return next(clonedRequest)
}

