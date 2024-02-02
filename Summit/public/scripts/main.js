/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const uid = user.uid;
			const phoneNumber = user.phoneNumber;
			const displayName = user.displayName;
			const email = user.email;
			const photoURL = user.photoURL;
			const isAnonymous = user.isAnonymous;

			console.log("The user is signed in.", uid);
			console.log('displayName :>> ', displayName);
			console.log('email :>> ', email);
			console.log('photoURL :>> ', photoURL);
			console.log('phoneNumber :>> ', phoneNumber);
			console.log('isAnonymous :>> ', isAnonymous);
			console.log('uid :>> ', uid);
			// ...



		} else {
			console.log("There is no user signed in.");
		}
	});

	const inputEmail = document.querySelector("#inputEmail");
	const inputPassword = document.querySelector("#inputPassword");

	document.querySelector("#signOut").onclick = (event) => {
		console.log(`Sign out`);

		firebase.auth().signOut().then(function () {
			// Sign-out successful.
			console.log("You are now signed out.");
		}).catch((error) => {
			// An error happened.
			console.log("Sign out error.");
		});
	};
	document.querySelector("#createAccount").onclick = (event) => {
		console.log(`Create account for email: ${inputEmail.value} password: ${inputPassword.value}`);

		firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			// ..
			console.log("Account creation error.");
		});
	};
	document.querySelector("#login").onclick = (event) => {
		console.log(`Log in for email: ${inputEmail.value} password: ${inputPassword.value}`);

		firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).catch(function (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("Login error.");
		});
	};

	document.querySelector("#anonymousAuth").onclick = (event) => {
		console.log("Using guest account");

		firebase.auth().signInAnonymously().catch(function (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("Guest user error.");
		});
	};

	rhit.startFirebaseUI();

};

rhit.startFirebaseUI = function () {
	// FirebaseUI config.
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};

	// Initialize the FirebaseUI Widget using Firebase.
	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded.
	ui.start('#firebaseui-auth-container', uiConfig);
};

rhit.main();
