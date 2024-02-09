/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Fred Hamer
 */

/** namespace. */

var rhit = rhit || {};



rhit.fbAuthManager = class {
	constructor() {
		this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		})
	}
}

rhit.LoginPageController = class {
	constructor() {

		this._user = null;
		this._unsubscribe = null;

		const inputEmail = document.querySelector("#inputEmail");
		const inputPassword = document.querySelector("#inputPassword");

		document.querySelector("#loginButton").onclick = (event) => {
			console.log(`Login with ${inputEmail.value}, ${inputPassword.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then((user) => {
				this._user = user;
				console.log(this._user);
				console.log(this.isSignedIn());
				rhit.checkForRedirects(null);
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
		document.querySelector("#todoButton").onclick = (event) => {
			console.log("Going to TODO page");
			rhit.checkForRedirects("todo");
			rhit.initalizePage();
		};
		document.querySelector("#goalsButton").onclick = (event) => {
			console.log("Going to GOALS page");
			rhit.checkForRedirects("goals");
			rhit.initalizePage();
		};
		document.querySelector("#habitsButton").onclick = (event) => {
			console.log("Going to HABITS page");
			rhit.checkForRedirects("habits");
			rhit.initalizePage();
		};
		document.querySelector("#summitLogoText").onclick = (event) => {
			console.log("Going to HOME page");
			rhit.checkForRedirects("home");
			rhit.initalizePage();
		};
	}

}

rhit.TodoPageController = class {
	constructor() {
		document.querySelector("#todoButton").onclick = (event) => {
			console.log("Going to TODO page");
			rhit.checkForRedirects("todo");
			rhit.initalizePage();
		};
		document.querySelector("#goalsButton").onclick = (event) => {
			console.log("Going to GOALS page");
			rhit.checkForRedirects("goals");
			rhit.initalizePage();
		};
		document.querySelector("#habitsButton").onclick = (event) => {
			console.log("Going to HABITS page");
			rhit.checkForRedirects("habits");
			rhit.initalizePage();
		};
		document.querySelector("#summitLogoText").onclick = (event) => {
			console.log("Going to HOME page");
			rhit.checkForRedirects("home");
			rhit.initalizePage();
		};
	}

}

rhit.GoalsPageController = class {
	constructor() {
		document.querySelector("#todoButton").onclick = (event) => {
			console.log("Going to TODO page");
			rhit.checkForRedirects("todo");
			rhit.initalizePage();
		};
		document.querySelector("#goalsButton").onclick = (event) => {
			console.log("Going to GOALS page");
			rhit.checkForRedirects("goals");
			rhit.initalizePage();
		};
		document.querySelector("#habitsButton").onclick = (event) => {
			console.log("Going to HABITS page");
			rhit.checkForRedirects("habits");
			rhit.initalizePage();
		};
		document.querySelector("#summitLogoText").onclick = (event) => {
			console.log("Going to HOME page");
			rhit.checkForRedirects("home");
			rhit.initalizePage();
		};
	}

}


rhit.checkForRedirects = function (buttonPressed) {
	if (document.querySelector(".loginPage") && rhit.LoginPageController.isSignedIn()) {
		window.location.href = '/home.html';
	}
	if (buttonPressed == "todo") {
		window.location.href = '/todo.html';
	}
	if (buttonPressed == "goals") {
		window.location.href = '/goals.html';
	}
	if (buttonPressed == "habits") {
		window.location.href = '/habits.html';
	}
	if (buttonPressed == "home") {
		window.location.href = 'home.html';
	}
}

rhit.initalizePage = function () {
	console.log("INITIALIZATION");
	const urlParams = new URLSearchParams(window.location.search);
	if (document.querySelector("#homePage")) {
		const uid = urlParams.get("uid");
		new rhit.HomePageController();
	}
	if (document.querySelector("#todoPage")) {
		new rhit.TodoPageController();
	}
	if (document.querySelector("#goalsPage")) {
		new rhit.GoalsPageController();
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("ready");
	if (document.querySelector(".loginPage")) {
		rhit.LoginPageController = new rhit.LoginPageController();
		console.log("Login Page Initialized");
		rhit.fbAuthManager = new rhit.fbAuthManager();
		console.log("Auth Manager Initalized");
	}
	if (document.querySelector("#homePage")) {
		new rhit.HomePageController();
	}
}

rhit.main();
