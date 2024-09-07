import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [provideHttpClient(withFetch())]
// }).catch((err) => console.error(err));
