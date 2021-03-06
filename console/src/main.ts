import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/modules/app-module/app.module';
import { environment } from './environments/environment';

// NOTE: CodeMirror's assets for a code syntax 
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

