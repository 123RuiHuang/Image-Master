import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EmotionDetectionPage } from '../pages/emotionDetection/emotionDetection';
import { TextDetectionPage } from '../pages/textDetection/textDetection';
import { ContentDetectionPage } from '../pages/contentDetection/contentDetection';
import { VerifyFacePage } from '../pages/verify-face/verify-face';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera} from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    EmotionDetectionPage,
    TextDetectionPage,
    ContentDetectionPage,
    VerifyFacePage
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
    VerifyFacePage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    Camera,
    FileTransfer, 
    File, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
