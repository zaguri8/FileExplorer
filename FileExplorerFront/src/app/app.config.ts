import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BaseUrlInterceptor } from '../interceptors/baseUrl.interceptor';
import { FileExplorerService } from '../services/fileexplorer.service';

// Things that all the app uses, HttpClient, Router,
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([BaseUrlInterceptor])),
    importProvidersFrom(FileExplorerService)
  ]
};

