import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the VerifyFacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-verify-face',
  templateUrl: 'verify-face.html',
})
export class VerifyFacePage {
  public flag = true;
  public base64Image1:string;
  public base64Image2:string;
  public result = "";
  
 
  constructor(private camera:Camera,private transfer: FileTransfer,private loadingCtrl:LoadingController) {
  }
  
  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }
    
    this.camera.getPicture(options).then((imageData) => {
     let cameraImageSelector
     if(this.flag) {
      this.base64Image1 = 'data:image/jpeg;base64,' + imageData;
      cameraImageSelector = document.getElementById('faceImage1');
      cameraImageSelector.setAttribute('src',this.base64Image1);
     }
     else {
      this.base64Image2 = 'data:image/jpeg;base64,' + imageData;
      cameraImageSelector = document.getElementById('faceImage2');
      cameraImageSelector.setAttribute('src',this.base64Image2); 
     }
     cameraImageSelector.setAttribute('style',"display:inline");
     this.flag = !this.flag
    }, (err) => {
     // Handle error
    
    });
  }

  getPhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
     
    }
    
    this.camera.getPicture(options).then((imageData) => {
     let cameraImageSelector
     if(this.flag) {
      this.base64Image1 = 'data:image/jpeg;base64,' + imageData;
      cameraImageSelector = document.getElementById('faceImage1');
      cameraImageSelector.setAttribute('src',this.base64Image1);
     }
     else {
       this.base64Image2 = 'data:image/jpeg;base64,' + imageData;
       cameraImageSelector = document.getElementById('faceImage2');
       cameraImageSelector.setAttribute('src',this.base64Image2); 
     }
     cameraImageSelector.setAttribute('style',"display:inline");
     this.flag = !this.flag;
     
    }, (err) => {
     // Handle error
    
    });

    
  }
  
  uploadPhoto(){
    let loader = this.loadingCtrl.create({
      content:"uploading..."
    });
    loader.present();
    const filetransfer:FileTransferObject = this.transfer.create();
    
    // options
    let options: FileUploadOptions = {
      fileKey:'photo',
      chunkedMode:false,
      httpMethod:'post',
      mimeType:'image/jpeg',
      headers:{}
    }
    options.fileName = Math.floor(Math.random()*100)+"face_detection.jpg",
    filetransfer.upload(this.base64Image1,'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/twoFaceDetection',options)
        .then((data) => {
          this.result = data.response;
          loader.dismiss();
        },(err) => {
          console.log(err);
          alert(err.message);
          loader.dismiss();
        });
    options.fileName = Math.floor(Math.random()*100)+"face_detection.jpg",
    filetransfer.upload(this.base64Image2,'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/twoFaceDetection',options)
        .then((data) => {
          this.result = data.response;
          loader.dismiss();
        },(err) => {
          console.log(err);
          alert(err.message);
          loader.dismiss();
        });
  }

}
