const globalThreshold = 0.5;
const strictThreshold = 0.4;

// /* Tiny Face Detector Options */
// const tinyParams = {
// 	inputSize: 224,
// 	scoreThreshold: globalThreshold
// };
// const tinyOptions = new faceapi.TinyFaceDetectorOptions(tinyParams);

/* MTCNN Model Detection Parameters */
const mtcnnParams = {
	// number of scaled versions of the input image passed through the CNN
	// of the first stage, lower numbers will result in lower inference time,
	// but will also be less accurate
	maxNumScales: 10,
	// scale factor used to calculate the scale steps of the image
	// pyramid used in stage 1
	scaleFactor: 0.709,
	// the score threshold values used to filter the bounding
	// boxes of stage 1, 2 and 3
	scoreThresholds: [0.6, 0.7, 0.7],
	// mininum face size to expect, the higher the faster processing will be,
	// but smaller faces won't be detected
	minFaceSize: 100
};
