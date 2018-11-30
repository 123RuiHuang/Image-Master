import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EmotionDetectionPage } from '../pages/emotionDetection/emotionDetection';
import { TextDetectionPage } from '../pages/textDetection/textDetection';
import { ContentDetectionPage } from '../pages/contentDetection/contentDetection';
import {CelebrityDetectionPage} from '../pages/celebrity-detection/celebrity-detection';
import {LandmarkDetectionPage} from '../pages/landmark-detection/landmark-detection';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera} from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Base64} from '@ionic-native/base64';
@NgModule({
  declarations: [
    MyApp,
    EmotionDetectionPage,
    TextDetectionPage,
    ContentDetectionPage,
    CelebrityDetectionPage,
    LandmarkDetectionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EmotionDetectionPage,
    TextDetectionPage,
    ContentDetectionPage,
    CelebrityDetectionPage,
    LandmarkDetectionPage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    Camera,
    FileTransfer, 
    File, 
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
