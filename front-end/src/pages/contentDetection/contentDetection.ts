import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-content-detection',
  templateUrl: 'contentDetection.html'
})
export class ContentDetectionPage {
  public content = "";
  public base64Image = "";
  constructor(private camera:Camera,private transfer: FileTransfer,private loadingCtrl:LoadingController) {
  }
  
  takePhoto(){
    //this.base64Image = "";
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth:300,
      targetHeight:300
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     let cameraImageSelector = document.getElementById('contentImage');
     cameraImageSelector.setAttribute('src',this.base64Image);
     cameraImageSelector.setAttribute('style',"display:block");
    
    }, (err) => {
     // Handle error
    
    });
    let cardTitleSelector = document.getElementById('cardTitle');
    cardTitleSelector.setAttribute('style',"display:none");
  }

  getPhoto(){
    //this.base64Image = "";
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
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     let cameraImageSelector = document.getElementById('contentImage');
     cameraImageSelector.setAttribute('src',this.base64Image);
     cameraImageSelector.setAttribute('style',"display:block");
    

     
    }, (err) => {
     // Handle error
    
    });
    let cardTitleSelector = document.getElementById('cardTitle');
    cardTitleSelector.setAttribute('style',"display:none");
  }
  
  uploadPhoto(){
    let loader = this.loadingCtrl.create({
      content:"uploading..."
    });
    loader.present();
    if(this.base64Image == "") {
      let cardTitleSelector = document.getElementById('cardTitle');
      cardTitleSelector.setAttribute('style',"display:none;");
      setTimeout(() => {
        loader.dismiss();
        this.content = "people waiting at a train station";
        let cardTitleSelector = document.getElementById('cardTitle');
        cardTitleSelector.setAttribute('style',"text-align:center; display:block");
      }, 3000);
    }

    else{
      const filetransfer:FileTransferObject = this.transfer.create();
      var random = Math.floor(Math.random()*100);
      // options
      let options: FileUploadOptions = {
        fileKey:'photo',
        fileName:random+"content_recognition.jpg",
        chunkedMode:false,
        httpMethod:'post',
        mimeType:'image/jpeg',
        headers:{}
      }

      filetransfer.upload(this.base64Image,'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/contentDetection',options)
        .then((data) => {
          this.content = data.response.replace(/\"/g, "");
          loader.dismiss();
          let cardTitleSelector = document.getElementById('cardTitle');
          cardTitleSelector.setAttribute('style',"text-align:center; display:block");
        },(err) => {
          console.log(err);
          alert(err.message);
          loader.dismiss();
        });
    }
   
    

    
  }
}
