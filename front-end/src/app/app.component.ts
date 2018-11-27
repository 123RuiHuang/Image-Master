import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { EmotionDetectionPage } from '../pages/emotionDetection/emotionDetection';
import { ContentDetectionPage } from '../pages/contentDetection/contentDetection';
import { TextDetectionPage } from '../pages/textDetection/textDetection';
import { VerifyFacePage } from '../pages/verify-face/verify-face'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = EmotionDetectionPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Emotion Detection', component: EmotionDetectionPage },
      { title: 'Content Detection', component: ContentDetectionPage },
      { title: 'Text Detection', component: TextDetectionPage},
      { title: 'Verify Face', component: VerifyFacePage},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
