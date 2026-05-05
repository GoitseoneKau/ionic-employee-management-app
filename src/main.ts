import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {  defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';


  const sqlite = new SQLiteConnection(CapacitorSQLite);

    if (Capacitor.getPlatform() === 'web') {
       sqlite.initWebStore();
    }

    if (Capacitor.getPlatform() === "web") {

      jeepSqlite(window);
      window.addEventListener('DOMContentLoaded', async () => {

        const jeepEl = document.createElement("jeep-sqlite");

        document.body.appendChild(jeepEl);
    
        jeepEl.autoSave = true;
        jeepEl.wasmPath = "assets";

      });
    }


// Above only required if you want to use a web platform <--
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes,withPreloading(PreloadAllModules)),
     provideIonicAngular(),
     
  ],
});
