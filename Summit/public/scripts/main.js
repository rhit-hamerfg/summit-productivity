/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Fred Hamer
 */

/** namespace. */

var rhit = rhit || {};

rhit.LoginPageController = class {
	constructor() {
		const inputEmail = document.querySelector("#inputEmail");
		const inputPassword = document.querySelector("#inputPassword");
		const inputName = document.querySelector("#inputName");

		document.querySelector("#createAccountButton").onclick = (event) => {
			console.log(`Create account for email: ${inputEmail.value} password: ${inputPassword.value} name ${inputName.value}`);
			firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				// ..
				console.log("Account creation error.");
			});
		}

		document.querySelector("#loginButton").onclick = (event) => {
			console.log(`Log in for email: ${inputEmail.value} password: ${inputPassword.value}`);
	
			firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).catch(function (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log("Login error.");
			});
		};
	}
}

rhit.fbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signOut() {
		firebase.auth().signOut();
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
}

rhit.checkForRedirects = function () {
	if (document.querySelector(".loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
	if (document.querySelector(".loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/home.html";
	}
	if (!document.querySelector(".homePage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/index.html";
	}
};

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);
	if (document.querySelector(".loginPage")) {
		new rhit.LoginPageController();
	}
// 	if (document.querySelector(".loginPage")) {
// 		// const imageId = rhit.storage.getImageId();
// 		const imageId = urlParams.get("id");
// 		if (!imageId) {
// 			window.location.href = '/';
// 		}
// 		rhit.fbSingleImageManager = new rhit.FbSingleImageManager(imageId);
// 		new rhit.DetailPageController();
// 	}
// 	if (document.querySelector("#detailPage")) {
// 		// const imageId = rhit.storage.getImageId();
// 		const imageId = urlParams.get("id");
// 		if (!imageId) {
// 			window.location.href = '/';
// 		}
// 		rhit.fbSingleImageManager = new rhit.FbSingleImageManager(imageId);
// 		new rhit.DetailPageController();
// 	}
// 	if (document.querySelector("#detailPage")) {
// 		// const imageId = rhit.storage.getImageId();
// 		const imageId = urlParams.get("id");
// 		if (!imageId) {
// 			window.location.href = '/';
// 		}
// 		rhit.fbSingleImageManager = new rhit.FbSingleImageManager(imageId);
// 		new rhit.DetailPageController();
// 	}
// 	if (document.querySelector("#detailPage")) {
// 		// const imageId = rhit.storage.getImageId();
// 		const imageId = urlParams.get("id");
// 		if (!imageId) {
// 			window.location.href = '/';
// 		}
// 		rhit.fbSingleImageManager = new rhit.FbSingleImageManager(imageId);
// 		new rhit.DetailPageController();
// 	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("ready");
	rhit.fbAuthManager = new rhit.fbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		rhit.checkForRedirects();
		rhit.initializePage();
	})
}

rhit.main();
