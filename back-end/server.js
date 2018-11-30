'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const request = require('request');
var storage = multer.diskStorage({
    destination:function (req, file, cb) {
        cb(null,'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});
const FaceSubscrieptionKey = 'a4544cebacbe441c98810e00ae8b4de3';
const computerVisionSubscrieptionKey = 'ce7ac76dd9c142378342d60bf2181ea7';
const faceDetectionEndPoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
const analyzeEndPoint = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze';
const textDetectionEndPoint = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr';
const faceDetectionParams = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

var faceDetectionOptions = {
    uri: faceDetectionEndPoint,
    qs: faceDetectionParams,
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : FaceSubscrieptionKey
    }
};

var analyzeParams = {
    'visualFeatures': 'Categories,Description,Color',
    'details': '',
    'language': 'en'
};

var analyzeOptions = {
    uri: analyzeEndPoint,
    qs: analyzeParams,
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : computerVisionSubscrieptionKey
    }
};

var textDetectionParams = {
    'language':'unk',
    'detectOrientation':'true',
};

var textDetectionOptions = {
    uri: textDetectionEndPoint,
    qs: textDetectionParams,
    //body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : computerVisionSubscrieptionKey
    }
}
app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

  function emotionDetection(imageID){
    let ImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
    console.log(ImageUrl);
    faceDetectionOptions.body = '{"url": ' + '"' + ImageUrl + '"}';
    let emotions = ['anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'];
    let emotion = "Not Known";
    let highestScore = 0;
    return new Promise(function(resolve,reject){
        request.post(faceDetectionOptions, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            reject(error)
            return;
        }
        else {
            let jsonResponse = JSON.parse(body);
            console.log(jsonResponse)
            if(jsonResponse[0] != undefined) {
            let result = jsonResponse[0].faceAttributes.emotion;
          //  console.log(result);
            for(var i = 0; i < 7; i++) {
                if(result[emotions[i]] > highestScore) {
                    emotion = emotions[i];
                    highestScore = result[emotions[i]];
                   
                }
            }
        }
            
            resolve(emotion);
        }
        
      })
    })
  };

  function contentDetection(imageID) {
        let ImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
        //console.log(ImageUrl);
        analyzeOptions.body =  '{"url": ' + '"' + ImageUrl + '"}';
        return new Promise(function(resolve,reject){
            request.post(analyzeOptions, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                reject(error);
                return;
            }
            else {
                let jsonResponse = JSON.parse(body);
                console.log(jsonResponse)
                let result = "";
                if(jsonResponse != undefined) {
                    result = jsonResponse.description.captions[0].text;
                }
            
                resolve(result);
            }
            
          })
        })
  }

  function celebrityDetection(imageID) {
      let ImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
      console.log(ImageUrl);
      analyzeOptions.body =  '{"url": ' + '"' + ImageUrl + '"}';
      return new Promise(function(resolve,reject){
          request.post(analyzeOptions,(error,response,body) => {
              if(error) {
                  console.log('Error: ',error);
                  reject(error);
                  return;
              }
              else {
                  let jsonResponse = JSON.parse(body);
                  console.log(JSON.stringify(JSON.parse(body), null, '  '))
                  let result = "Not Known";
                  if(jsonResponse != undefined && jsonResponse.categories[0].detail != undefined && jsonResponse.categories[0].detail.celebrities[0] != undefined) {
                      result = jsonResponse.categories[0].detail.celebrities[0].name;
                  }
                  resolve(result);
              }
          })
      })

  }
 
  function landmarkDetection(imageID) {
    let ImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
    console.log(ImageUrl);
    analyzeOptions.body =  '{"url": ' + '"' + ImageUrl + '"}';
    return new Promise(function(resolve,reject){
        request.post(analyzeOptions,(error,response,body) => {
            if(error) {
                console.log('Error: ',error);
                reject(error);
                return;
            }
            else {
                let jsonResponse = JSON.parse(body);
                console.log(JSON.stringify(JSON.parse(body), null, '  '))
                //console.log(jsonResponse);
                let result = "";
                if(jsonResponse != undefined && jsonResponse.categories != undefined) {
                   // console.log(jsonResponse);
                    result = extractLandmarkFromJsonObject(jsonResponse);
                    console.log(result);
                    if(result == "") result = "Not Known";
                }
                resolve(result);
            }
        })
    })
  }

  function textDetection(imageID) {
    let ImageUrl = 'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001/'+imageID;
    console.log(ImageUrl);
    textDetectionOptions.body= '{"url": ' + '"' + ImageUrl + '"}';
    return new Promise(function(resolve,reject){
        request.post(textDetectionOptions, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            reject(error)
            return;
        }
        else {
            let jsonResponse = JSON.parse(body);
            let result = "Not Known";
            console.log(JSON.stringify(JSON.parse(body), null, '  '))
            if(jsonResponse != undefined) {
                //result = jsonResponse.description.captions[0].text;
                //console.log(jsonResponse.regions[0].lines[0].words);
                result = extractTextFromJsonObj(jsonResponse);
                console.log(result);
            }
        
            resolve(result);
        }
        
      })
    })
  }

  function extractLandmarkFromJsonObject(jsonObject) {
        var result = "";
        for(var i = 0; i < jsonObject.categories.length; i++) {
            if(jsonObject.categories[i].detail != undefined && jsonObject.categories[i].detail.landmarks != undefined && jsonObject.categories[i].detail.landmarks.length != 0) {
                result = jsonObject.categories[i].detail.landmarks[0].name;
                break;
            }
        }
        return result;
  }
  function extractTextFromJsonObj(jsonObj) {
      //console.log(jsonObj.regions.length;)
      var result = "";
      for(var i = 0; i < jsonObj.regions.length; i++) {
          for(var j = 0; j < jsonObj.regions[i].lines.length; j++) {
              for(var m = 0; m < jsonObj.regions[i].lines[j].words.length; m++) {
                  result += (" " +  jsonObj.regions[i].lines[j].words[m].text);
              }
          }
      }
      return result;
  }
 
 


app.post('/emotionDetection',upload.single('photo'),(req,res,next) =>{
    //console.log(req);
    var emotionDetectionPromise;
    emotionDetectionPromise = emotionDetection(req.file.originalname);
    emotionDetectionPromise.then(function(result) {
      // console.log(result);
        res.json(result);
    }, function(err) {
        res.json("Not Known");
    })

});

app.post('/contentDetection',upload.single('photo'),(req,res,next) => {
   // console.log("hello");
    var contentDetectionPromise = contentDetection(req.file.originalname);
    contentDetectionPromise.then(function(result) {
        console.log(result);
        res.json(result);
    }, function(err) {
        res.json("Not Known");
    })
})

app.post('/textDetection',upload.single('photo'),(req,res,next) => {
    var textDetectionPromise = textDetection(req.file.originalname);
    textDetectionPromise.then(function(result) {
        //console.log(result)
        res.json(result);
    }, function(err) {
        res.json("Not Known")
    })
})


app.post('/celebrityDetection',upload.single('photo'),(req,res,next) => {
    console.log("hello");
   var celebrityDetectionPromise = celebrityDetection(req.file.originalname);
   celebrityDetectionPromise.then(function(result) {
       console.log(result);
       res.json(result);
   },function(err) {
       res.json("Not Known");
   })
  
})

app.post('/landmarkDetection',upload.single('photo'),(req,res,next) => {
    console.log("landmark");
    var landmarkDetectionPromise = landmarkDetection(req.file.originalname);
    landmarkDetectionPromise.then(function(result) {
        console.log(result);
        res.json(result);
    },function(err) {
        res.json("Not Known");
    })
})

app.listen(3001);
console.log("Server is running on port 3001"); 