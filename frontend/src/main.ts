import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {AuthInterceptor} from './app/auth/auth-interceptor';
import {provideHttpClient, withInterceptors,} from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
}).catch((err) => console.error(err));
