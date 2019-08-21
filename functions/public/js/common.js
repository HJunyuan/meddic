/* ================= Face-api Usage ================= */

/* Load Models */
async function loadModels() {
	const MODEL_URL = "models";
	// await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
	await faceapi.loadMtcnnModel(MODEL_URL);
	await faceapi.loadFaceLandmarkModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
	console.log("Loaded MTCNN model");
}

/* ================= Video ================= */

/* Resize Canvas */
function resizeCanvasAndResults(canvas, inputVideo, results) {
	canvas.width = inputVideo.offsetWidth;
	canvas.height = inputVideo.offsetHeight;

	return faceapi.resizeResults(results, {
		width: inputVideo.offsetWidth,
		height: inputVideo.offsetHeight
	});
}

/* Request camera stream */
function requestCameraStream(inputVideo) {
	/* Request user's webcam and stream images to video element */
	const constraints = {
		video: { width: { min: 1280 }, height: { min: 720 } },
		audio: false
	};

	navigator.mediaDevices.getUserMedia(constraints).then(
		stream => {
			inputVideo.srcObject = stream;
		},
		err => console.error(err, "Please grant camera access or camera is unsupported.")
	);

	console.log("Requested for camera stream");
}

/* Capture & crop with given coordinates */
function captureAndCrop(orgInput, x, y, endWidth, endHeight) {
	/* Offset x & y to capture more hair */
	x = x - x * 0.001;
	y = y - y * 0.3;

	// draw image to canvas and get image data
	var canvas0 = document.createElement("canvas");

	canvas0.width = orgInput.videoWidth; // Intrinsic Width
	canvas0.height = orgInput.videoHeight; // Intrinsic Height

	var ctx = canvas0.getContext("2d");
	ctx.drawImage(orgInput, 0, 0);
	var imageData = ctx.getImageData(x, y, endWidth, endHeight);

	/* Create destiantion canvas */
	var canvas1 = document.createElement("canvas");

	canvas1.width = endWidth;
	canvas1.height = endHeight;

	var ctx1 = canvas1.getContext("2d");
	ctx1.rect(0, 0, endWidth, endHeight);
	ctx1.fillStyle = "white";
	ctx1.fill();
	ctx1.putImageData(imageData, 0, 0);

	// Return final image
	return canvas1.toDataURL("image/png");
}

/* ================= Network Functions ================= */

/* Get URL Parameters */
function getURLParam(variable, window) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return decodeURI(pair[1]);
		}
	}
	return false;
}

/* ================= Archive ================= */

/* From exisiting database - Get descriptors and label them */
// async function labelCurrFaces() {
// 	// Filenames to label
// 	const labels = ["KYLE", "NELSON", "RUSS", "GW"];

// 	/* Set labeledFaceDescriptors */
// 	labeledFaceDescriptors = await Promise.all(
// 		labels.map(async label => {
// 			// fetch image data from urls and convert blob to HTMLImage element
// 			const imgUrl = `faces/${label}.png`;
// 			const img = await faceapi.fetchImage(imgUrl);

// 			// detect the face with the highest score in the image and compute it's landmarks and face descriptor
// 			const fullFaceDescription = await faceapi
// 				.detectSingleFace(img, mtcnnOptions)
// 				.withFaceLandmarks()
// 				.withFaceDescriptor();

// 			if (!fullFaceDescription) {
// 				throw new Error(`No faces detected in file name: ${label}`);
// 			}

// 			const faceDescriptors = [fullFaceDescription.descriptor];
// 			return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
// 		})
// 	);

// 	console.log("Labeled all existing faces");
// }

// function updateAttendance(label, score) {
// 	// const re = /\((.*?)\)/;
// 	// const score = parseInt(label.match(re)[1]);
// 	// const identity = label.substring(0, label.indexOf("("));

// 	const toStore = {
// 		label: label,
// 		score: score
// 	};

// 	const length = attendanceSheet.length;

// 	/* Reject high distance */
// 	if (score > strictThreshold) return;

// 	// If array is empty
// 	if (length == 0) {
// 		attendanceSheet.push(toStore);
// 		// To-do: Create function to print out names in attendanceSheet
// 		console.log(attendanceSheet);
// 		return;
// 	}

// 	// For loop 0 to (length-1)+1 = length
// 	for (var i = 0; i <= length; i++) {
// 		// If for loop reaches the end of array list
// 		if (i == length) {
// 			attendanceSheet.push(toStore);
// 			// To-do: Create function to print out names in attendanceSheet
// 			console.log(attendanceSheet);
// 			return;
// 		}
// 		// If identity is already present
// 		if (label.match(attendanceSheet[i].label)) {
// 			return;
// 		}
// 	}
// }

// /* Use MTCNN Model on inputVideo */
// const mtcnnResults = await faceapi.mtcnn(inputVideo, mtcnnParams);

// /* Detect Faces and Landmarks */
// const detectionsArray = mtcnnResults.map(fd => fd.detection);
// const landmarksArray = mtcnnResults.map(fd => fd.landmarks);

// /* Draw onto canvas */
// faceapi.drawDetection(canvas, detectionsArray, { withScore: true });
// faceapi.drawLandmarks(canvas, landmarksArray, { lineWidth: 4, color: "red" });
