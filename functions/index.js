/* Dependencies */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

/* Initialisation */
const app = express();

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));

/* Firebase Initialisation */
var serviceAccount = require("../private/meddic-57a28-firebase-adminsdk-lhwmy-a07a940214.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://meddic-57a28.firebaseio.com"
});

const database = admin.database();

/* Define directories */
const publicDir = path.join(__dirname, "public");
const viewsDir = path.join(publicDir, "views");

/* ================= GET Requests ================= */
// Home Page
app.get("/", (req, res) => res.sendFile(path.join(viewsDir, "index.html")));

// Registration Page
app.get("/registration", (req, res) =>
	res.sendFile(path.join(viewsDir, "registration.html"))
);

/* ================= API: POST Requests ================= */
// New Student Registration
app.post("/api/newregistration", (req, res) => {
	/* Sanitize */
	const person = req.body;
	const fullName = person.fullName.toString();
	const nric = person.nric.toString().toUpperCase();
	const gender = person.gender.toString();
	const dateOfBirth = person.dateOfBirth.toString();
	const drugAllergies = person.drugAllergies.toString();
	const preExisting = person.preExisting.toString();
	const comments = person.comments.toString();
	const descriptors = person.descriptors;
	const imageURL = person.imageURL;

	regPatient(
		fullName,
		nric,
		gender,
		dateOfBirth,
		drugAllergies,
		preExisting,
		comments,
		descriptors,
		imageURL
	);

	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ msg: "Successfully registered!" }));
	return;
});

// Get students from Mod -> Group
app.post("/api/getpatients", (req, res) => {
	let databaseRef = database.ref("patients");

	databaseRef.once("value", function(snapshot) {
		var array = [];
		snapshot.forEach(function(childSnapshot) {
			array.push(childSnapshot);
		});
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify(array));
		return;
	});
});

/* Handle 404 */
app.use(function(req, res, next) {
	res
		.status(404)
		.sendFile(path.join(viewsDir, "404.html"))
		.end();
});

/* ================= Functions ================= */
function regPatient(
	fullName,
	nric,
	gender,
	dateOfBirth,
	drugAllergies,
	preExisting,
	comments,
	descriptors,
	imageURL
) {
	let databaseRef = database.ref("patients");
	databaseRef = databaseRef.child(nric);

	databaseRef.set({
		fullName: fullName,
		nric: nric,
		gender: gender,
		dateOfBirth: dateOfBirth,
		drugAllergies: drugAllergies,
		preExisting: preExisting,
		comments: comments,
		descriptors: descriptors,
		imageURL: imageURL
	});
}

exports.app = functions.https.onRequest(app);
