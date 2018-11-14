'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const request = require('request');
const faceDetectSubscriptionKey = 'f091a0b8e15a40c38b4e56128bb4baf0';
const faceDetectEndPoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
const faceDetectParams = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};
var faceDetectOptions = {
    uri: faceDetectEndPoint,
    qs: faceDetectParams,
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : faceDetectSubscriptionKey
    }
};

function emotionDetection(imageID){
    let FaceImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
    console.log(FaceImageUrl);
    faceDetectOptions.body = '{"url": ' + '"' + FaceImageUrl + '"}';
    let emotions = ['anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'];
    let emotion = "";
    let highestScore = 0;
    return new Promise(function(resolve,reject){
        request.post(faceDetectOptions, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            reject(error)
            return;
        }
        else {
            let jsonResponse = JSON.parse(body);
            console.log(jsonResponse)
            let result = jsonResponse[0].faceAttributes.emotion;
            console.log(result);
            for(var i = 0; i < 7; i++) {
                if(result[emotions[i]] > highestScore) {
                    emotion = emotions[i];
                    highestScore = result[emotions[i]];
                   
                }
            }
            resolve({emotion});
        }
        
      })
    })
  };
 


app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var storage = multer.diskStorage({
    destination:function (req, file, cb) {
        cb(null,'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});
app.post('/',upload.single('photo'),(req,res,next) =>{
    var emotionDetectionPromise = emotionDetection(req.file.originalname);
    emotionDetectionPromise.then(function(result) {
       console.log(result);
        res.json(result);
    }, function(err) {
        res.json("Unknow");
    })

});
//14d032c0-524a-4cfb-b1d3-1055908cd54e


app.listen(3001);
console.log("Server is running on port 3001"); 