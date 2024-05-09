import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ROUTES} from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(ROUTES), provideAnimationsAsync()]
};
