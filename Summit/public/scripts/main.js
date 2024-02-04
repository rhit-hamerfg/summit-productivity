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

		this._user = null;
		this._unsubscribe = null;

		this._unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const uid = user.uid;
				console.log("Logged in", uid);
				window.location.href = '/home.html';
			}
			if (this._unsubscribe) {
				this._unsubscribe();
			}
		})

		const inputEmail = document.querySelector("#inputEmail");
		const inputPassword = document.querySelector("#inputPassword");

		document.querySelector("#loginButton").onclick = (event) => {
			console.log(`Login with ${inputEmail.value}, ${inputPassword.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then((user) => {
				this._user = user;
				console.log(this._user);
				console.log(this.isSignedIn());
			});
		}

		document.querySelector("#createAccountButton").onclick = (event) => {
			console.log(`Create account for ${inputEmail.value}, ${inputPassword.value}`);
			firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value)
		}
	}

	isSignedIn() {
		return !!this._user;
	}

	stopListening(changeListener) {
		this._unsubscribe();
	}
}

rhit.HomePageController = class {
    constructor() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                console.log("User not signed in, redirecting to login page");
                window.location.href = '/login.html'; // Adjust the path as necessary
            }
        });

        // Other home page initialization code...
    }
}


rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.LoginPageController.isSignedIn()) {
		window.location.href = '/home.html';
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
}

rhit.main();
