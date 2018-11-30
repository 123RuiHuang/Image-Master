# Image-Master

Currently, some big company like google, amazon, Microsoft etc publish their own AI service.
Microsoft's cognitive service is one of them. It provide powerful web service api for user.
In this project, we build a ionic mobile app called Image-Master and integrate the computer vision ability of Microsoft's cognitive service 
into this app. It contains the following 5 functions:

1: emotion detection: input is an image, output is a emotion tag

2: content detection: input is an image, output is a description about what happened in the image, in other 
   words, the content of the image
   
3: text detection: input is an image containing printed text, output is the text in the image

4: celebrity detection: input is an image containing a celebrity, output is the name of the celebrity

5: landmark detection: input is an image containing a landmark, output is the name of the landmark

Demo of all the function is in the folder demo/


Below is the architecture of the project

Front end: front end is a ionic app. Ionic app is a kind of hybird app that can run in mobile device like android iphone etc, but it is implemented using html typescript and other web develop technology.

Back end:  backed end is a web service implemented using nodejs. 

Interaction: front end send request which contains an image file to back end, back end receive the request and save the image to file system. Then back end send the image to microsoft's cognitive api for detection. After back end receive the detection result from cognitive service, it send back the result to front end ionic app.


   


