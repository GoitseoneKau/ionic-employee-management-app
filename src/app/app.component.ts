import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Animation, Style, BackgroundColorOptions } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor() {
    
  }

  ngOnInit() {
    this.setBg();
  }

  async setBg() {
    if (Capacitor.getPlatform() !== 'web') {
      await StatusBar.show()
      //Display statusbar above app
      await StatusBar.setOverlaysWebView({ overlay: true })
      //SET color of status bar i.e Dark=white text,LIGHT=black text
      await StatusBar.setStyle({ style: Style.Dark });
      //set mobile status bar background color
      await StatusBar.setBackgroundColor({ color: "#0163aa" });
    }


  }
}
