/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Fred Hamer
 */

/** namespace. */

var rhit = rhit || {};

rhit.FB_KEY_TODO = "todo";
rhit.FB_KEY_PRIORITY = "priority";
rhit.FB_KEY_AUTHOR = "author";
rhit.FB_KEY_HABIT = "habit";
rhit.FB_KEY_STREAK = "0";
rhit.FB_KEY_GOAL = "goal";
rhit.FB_KEY_DATE = "date";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_USER = "user";
rhit.FB_KEY_NAME = "name"
rhit.FB_KEY_NUMTODOS = "numTodos";
rhit.FB_KEY_NUMHABITS = "numHabits";
rhit.FB_KEY_NUMGOALS = "numGoals";
rhit.FB_KEY_INDEX = 49;
rhit.fbSingleTodoManager = null;
rhit.fbSingleHabitManager = null;
rhit.fbSingleGoalManager = null;
rhit.fbUserManager = null;
rhit.fbQuoteManager = null;
rhit.fbAuthManager = null;

//From CSSE280 MovieQuotes FA
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.LoginPageController = class {
	constructor() {
		const inputEmail = document.querySelector("#inputEmail");
		const inputPassword = document.querySelector("#inputPassword");

		document.querySelector("#createAccountButton").onclick = (event) => {
			firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value)
				.catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
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

rhit.HomePageController = class {
	constructor(uid) {
		document.querySelector("#signOutButton").onclick = (event) => {
			firebase.auth().signOut().then(function () {
				window.location.href = '/';
			}).catch(function (error) {
				console.log("Sign out error");
			})
		}

		document.querySelector("#todoButton").onclick = (event) => {
			window.location.href = `/todo.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#habitsButton").onclick = (event) => {
			window.location.href = `/habits.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#goalsButton").onclick = (event) => {
			window.location.href = `/goals.html?uid=${rhit.fbAuthManager.uid}`
		}

		this.progress = null;
		this.progressStart = 0;
		this.progressEnd = 25 * 60;
		let speed = 1000;
		this.started = false;
		let secondsRemaining = 0;
		let minutesRemaining = 0;

		document.querySelector(".outerRing").onclick = (event) => {
			if (!this.started) {
				this.started = true;
				this.startStopProgress(secondsRemaining, minutesRemaining, speed);
			}
			else {
				this.started = false;
				this.startStopProgress(secondsRemaining, minutesRemaining, speed);
			}
		}

		document.querySelector(".outerRing").addEventListener("dblclick", (event) => {
			this.resetValues();
		})

		rhit.fbQuoteManager.beginListening(this.updateQuote.bind(this));
	}

	updateQuote() {
		const quote = htmlToElement(`<div id="quote"></div>`);
		let index = Math.floor((Math.random() * 100) / 2);
		if (index == 50) {
			index = 49;
		}
		let addQuote = rhit.fbQuoteManager.getQuoteAtIndex(index);
		quote.innerHTML = (addQuote.quote);
		const oldQuote = document.querySelector("#quote");
		oldQuote.removeAttribute("id");
		oldQuote.hidden = true;
		oldQuote.parentElement.appendChild(quote);
	}

	updateName() {
		if (fbAuthManager.name == null) {
			console.log("No name");
		}
	}

	timer(secondsRemaining, minutesRemaining) {
		this.progressStart++;
		secondsRemaining = Math.floor((this.progressEnd - this.progressStart) % 60);
		minutesRemaining = Math.floor((this.progressEnd - this.progressStart) / 60);
		console.log(minutesRemaining, secondsRemaining);
		document.querySelector("#seconds").innerHTML = secondsRemaining;
		document.querySelector("#minutes").innerHTML = minutesRemaining;
		if (this.progressStart == this.progressEnd) {
			clearInterval(this.progress);
			this.progress = null;
		}
	}

	startStopProgress(secondsRemaining, minutesRemaining, speed) {
		if (this.started) {
			this.progress = setInterval(() => this.timer(secondsRemaining, minutesRemaining), speed)
		} else {
			clearInterval(this.progress);
			this.progress = null;
		}
	}

	resetValues() {
		document.querySelector("#minutes").innerHTML = "25";
		document.querySelector("#seconds").innerHTML = "00";
		this.started = false;
		clearInterval(this.progress);
		this.progress = null;
		this.progressStart = 0;
		this.progresEnd = 25 * 60;;
	}
}

rhit.fbQuoteManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection("quotes");
		this._unsubscribe = null;
	}
	beginListening(changeListener) {
		const query = firebase.firestore().collection("quotes").orderBy("index", "asc");
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length;
	}
	getQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const quote = new rhit.Quote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			index,
		);
		return quote;
	}
}

rhit.Quote = class {
	constructor(id, quote, index) {
		this.id = id;
		this.quote = quote;
		this.index = index;
	}
}

rhit.TodoPageController = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/home.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#habitsButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/habits.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#goalsButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/goals.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#submitAddTodo").onclick = (event) => {
			const todo = document.querySelector("#inputTodo").value;
			let priority = "";

			if (document.getElementById("highPriority").checked) {
				priority = "ahigh";
			} else if (document.getElementById("medPriority").checked) {
				priority = "bmed";
			} else {
				priority = "clow";
			}

			console.log(priority);
			console.log(todo);
			rhit.fbTodoManager.add(todo, priority);
		}

		$("#addTodo").on("show.bs.modal", (event) => {
			document.querySelector("#inputTodo").value = "";
		});
		$("#addTodo").on("shown.bs.modal", (event) => {
			document.querySelector("#inputTodo").focus();
		});

		document.querySelector("#submitEditTodo").onclick = (event) => {
			rhit.fbSingleTodoManager = new rhit.FbSingleTodoManager(docSnapshot.id);
			const editTodo = rhit.fbTodoManager.getTodoAtIndex
			const todo = document.querySelector("#inputTodo").value;
			rhit.fbSingleTodoManager.updateTodo(todo);
		}

		rhit.fbTodoManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="todoContainer"></div>');
		console.log(rhit.fbAuthManager.uid);
		console.log(rhit.fbTodoManager.length);
		for (let i = 0; i < rhit.fbTodoManager.length; i++) {
			const todo = rhit.fbTodoManager.getTodoAtIndex(i);
			if (todo.author == rhit.fbAuthManager.uid) {
				const newTodo = this._createTodo(todo);
				newList.appendChild(newTodo);
			}
		}

		const oldList = document.querySelector("#todoContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createTodo(Todo) {
		const todo = htmlToElement(`<div class="toDoItemElement">
		<div class="toDoItemText">${Todo.todo}</div>
		<div class="priorityCheckBox">
        <div class="${Todo.priority}"></div>
        <div class="checkBox"><i class="material-icons checkmark">done</i></div>
      	</div>
		</div>`);
		const fbSingleTodoManager = new rhit.FbSingleTodoManager(Todo.id);
		const oldPriority = todo.querySelector(`.${Todo.priority}`);
		oldPriority.onclick = (event) => {
			if (oldPriority.className == "ahigh") {
				oldPriority.className = "bmed";
			}
			else if (oldPriority.className == "bmed") {
				oldPriority.className = "clow";
			}
			else {
				oldPriority.className = "ahigh";
			}
			fbSingleTodoManager.update(Todo.todo, oldPriority.className);
		}
		const oldTodo = todo.querySelector(".toDoItemText");
		oldTodo.onclick = (event) => {
			console.log("edit modal");
			$("#editTodo").modal("show");

			document.querySelector("#submitEditTodo").onclick = (event) => {
				rhit.fbSingleTodoManager = new rhit.FbSingleTodoManager(Todo.id);
				const todo = document.querySelector("#inputEditTodo").value;
				console.log(todo);
				rhit.fbSingleTodoManager.updateTodo(todo);
				console.log("Todo edited");
			}
		}
		const checkbox = todo.querySelector(".checkBox");
		checkbox.onclick = (event) => {
			fbSingleTodoManager.delete();
		}
		return todo;
	}
}

rhit.Todo = class {
	constructor(id, todo, priority, author) {
		this.id = id;
		this.todo = todo;
		this.priority = priority;
		this.author = author;
	}
}

rhit.fbTodoManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection("todos");
		this._unsubscribe = null;
	}
	add(todo, priority) {
		this._ref.add({
			[rhit.FB_KEY_TODO]: todo,
			[rhit.FB_KEY_PRIORITY]: priority,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
		})
	}
	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_PRIORITY, "asc");
		if (this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
		}
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length;
	}
	getTodoAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const todo = new rhit.Todo(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_TODO),
			docSnapshot.get(rhit.FB_KEY_PRIORITY),
			docSnapshot.get(rhit.FB_KEY_AUTHOR),
		);
		return todo;
	}
}

rhit.FbSingleTodoManager = class {
	constructor(todoID) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection("todos").doc(todoID);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		})

	}

	stopListening() {
		this._unsubscribe();
	}

	update(todo, priority) {
		this._ref.update({
			[rhit.FB_KEY_TODO]: todo,
			[rhit.FB_KEY_PRIORITY]: priority,
		})
	}
	updateTodo(todo) {
		this._ref.update({
			[rhit.FB_KEY_TODO]: todo,
		})
	}
	delete() {
		return this._ref.delete()
	}

	get todo() {
		return this._documentSnapshot.get(rhit.FB_KEY_TODO);
	}

	get priority() {
		return this._documentSnapshot.get(rhit.FB_KEY_PRIORITY);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}
}

rhit.HabitsPageController = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/home.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#todoButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/todo.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#goalsButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/goals.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#submitAddHabit").onclick = (event) => {
			const habit = document.querySelector("#inputHabit").value;
			let streak = 0;

			console.log(habit);
			console.log(streak);
			rhit.fbHabitsManager.add(habit, streak);
		}

		$("#addHabit").on("show.bs.modal", (event) => {
			document.querySelector("#inputHabit").value = "";
		});
		$("#addHabit").on("shown.bs.modal", (event) => {
			document.querySelector("#inputHabit").focus();
		});

		rhit.fbHabitsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="habitsList"></div>');
		for (let i = 0; i < rhit.fbHabitsManager.length; i++) {
			const habit = rhit.fbHabitsManager.getHabitAtIndex(i);
			if (habit.author == rhit.fbAuthManager.uid) {
				const newHabit = this._createHabit(habit);
				newList.appendChild(newHabit);
			}
		}

		const oldList = document.querySelector("#habitsList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createHabit(Habit) {
		const habit = htmlToElement(`<div class="habitItemElement">
        <div class="habitItemText">${Habit.habit}</div>
        <div class="priorityCheckBox">
        <div class="streakbox">${Habit.streak}x</div>
        <div class="checkBox"><i class="material-icons checkmark">done</i></div>
        </div>
      	</div>`);
		const fbSingleHabitManager = new rhit.FbSingleHabitManager(Habit.id);
		const oldHabit = habit.querySelector(".habitItemText");
		oldHabit.onclick = (event) => {
			console.log("edit modal");
			$("#editHabit").modal("show");
			rhit.fbSingleHabitManager = new rhit.FbSingleHabitManager(Habit.id);
			document.querySelector("#submitEditHabit").onclick = (event) => {
				const habit = document.querySelector("#inputEditHabit").value;
				console.log(habit);
				rhit.fbSingleHabitManager.update(habit, Habit.streak);;
			}
			document.querySelector("#deleteButton").onclick = (event) => {
				rhit.fbSingleHabitManager.delete();
			}
		}
		const checkbox = habit.querySelector(".checkBox");
		checkbox.onclick = (event) => {
			let streak = Habit.streak;
			streak = streak + 1;
			fbSingleHabitManager.update(Habit.habit, streak);
		}
		return habit;
	}
}

rhit.Habit = class {
	constructor(id, habit, streak, author) {
		this.id = id;
		this.habit = habit;
		this.streak = streak;
		this.author = author;
	}
}

rhit.fbHabitsManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection("habits");
		this._unsubscribe = null;
	}

	add(habit, streak) {
		this._ref.add({
			[rhit.FB_KEY_HABIT]: habit,
			[rhit.FB_KEY_STREAK]: streak,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
		})
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_STREAK, "desc");
		if (this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
		}
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getHabitAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const habit = new rhit.Habit(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_HABIT),
			docSnapshot.get(rhit.FB_KEY_STREAK),
			docSnapshot.get(rhit.FB_KEY_AUTHOR),
		);
		return habit;
	}
}

rhit.FbSingleHabitManager = class {
	constructor(habitID) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection("habits").doc(habitID);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		})

	}

	stopListening() {
		this._unsubscribe();
	}

	update(habit, streak) {
		this._ref.update({
			[rhit.FB_KEY_HABIT]: habit,
			[rhit.FB_KEY_STREAK]: streak,
		})
			.then(() => {
				console.log("Updated");
			})
			.catch(function (error) {
				console.error("Error: ", error);
			})
	}
	delete() {
		return this._ref.delete();
	}

	get habit() {
		return this._documentSnapshot.get(rhit.FB_KEY_HABIT);
	}

	get streak() {
		return this._documentSnapshot.get(rhit.FB_KEY_STREAK);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}
}

rhit.GoalsPageController = class {
	constructor() {
		document.querySelector("#homeButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/home.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#habitsButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/habits.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#todoButton").onclick = (event) => {
			console.log("Redirect");
			window.location.href = `/todo.html?uid=${rhit.fbAuthManager.uid}`
		}

		document.querySelector("#submitAddGoal").onclick = (event) => {
			const goal = document.querySelector("#inputGoal").value;
			const date = document.querySelector("#inputDate").value;
			rhit.fbGoalsManager.add(goal, date);
		}

		$("#addGoal").on("show.bs.modal", (event) => {
			document.querySelector("#inputGoal").value = "";
			document.querySelector("#inputDate").value = "";
		});
		$("#addGoal").on("shown.bs.modal", (event) => {
			document.querySelector("#inputGoal").focus();
		});

		rhit.fbGoalsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="goalsContainer"></div>');
		for (let i = 0; i < rhit.fbGoalsManager.length; i++) {
			const goal = rhit.fbGoalsManager.getGoalAtIndex(i);
			if (goal.author == rhit.fbAuthManager.uid) {
				const newGoal = this._createGoal(goal);
				newList.appendChild(newGoal);
			}
		}

		const oldList = document.querySelector("#goalsContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createGoal(Goal) {
		const goal = htmlToElement(`<div class="goalsItemElement">
        <div class="goalsItemText">${Goal.goal}</div>
        <div class="priorityCheckBox">
          <div class="datebox">${Goal.date}</div>
          <div class="checkBox"><i class="material-icons checkmark">emoji_events</i></div>
        </div>
      </div>`);
		const fbSingleGoalManager = new rhit.FbSingleGoalManager(Goal.id);
		const oldGoal = goal.querySelector(".goalsItemText");
		$("#editGoal").on("show.bs.modal", (event) => {
			document.querySelector("#inputEditGoal").value = Goal.goal;
			document.querySelector("#inputEditDate").value = Goal.date;
		});
		oldGoal.onclick = (event) => {
			$("#editGoal").modal("show");
			rhit.fbSingleGoalManager = new rhit.FbSingleGoalManager(Goal.id);
			document.querySelector("#submitEditGoal").onclick = (event) => {
				const goal = document.querySelector("#inputEditGoal").value;
				const date = document.querySelector("#inputEditDate").value;
				rhit.fbSingleGoalManager.update(goal, date);
			}
		}
		const checkbox = goal.querySelector(".checkBox");
		checkbox.onclick = (event) => {
			fbSingleGoalManager.delete();
		}
		return goal;
	}
}

rhit.Goal = class {
	constructor(id, goal, date, author) {
		this.id = id;
		this.goal = goal;
		this.date = date;
		this.author = author;
	}
}

rhit.fbGoalsManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection("goals");
		this._unsubscribe = null;
	}
	add(goal, date) {
		this._ref.add({
			[rhit.FB_KEY_GOAL]: goal,
			[rhit.FB_KEY_DATE]: date,
			[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
		})
	}
	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_DATE, "asc");
		if (this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
		}
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}
	get length() {
		return this._documentSnapshots.length;
	}
	getGoalAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const goal = new rhit.Goal(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_GOAL),
			docSnapshot.get(rhit.FB_KEY_DATE),
			docSnapshot.get(rhit.FB_KEY_AUTHOR),
		);
		return goal;
	}
}

rhit.FbSingleGoalManager = class {
	constructor(goalID) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection("goals").doc(goalID);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		})

	}

	stopListening() {
		this._unsubscribe();
	}

	update(goal, date) {
		this._ref.update({
			[rhit.FB_KEY_GOAL]: goal,
			[rhit.FB_KEY_DATE]: date,
		})
			.then(() => {
				console.log("Updated");
			})
			.catch(function (error) {
				console.error("Error: ", error);
			})
	}
	delete() {
		return this._ref.delete()
	}

	get goal() {
		return this._documentSnapshot.get(rhit.FB_KEY_GOAL);
	}

	get date() {
		return this._documentSnapshot.get(rhit.FB_KEY_DATE);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
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
	get name() {
		return this._user.displayName;
	}
}

rhit.checkForRedirects = function () {
	if (document.querySelector(".loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = `/home.html?uid=${rhit.fbAuthManager.uid}`;
	}
	if (document.querySelector(".homePage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/index.html";
	}
	if (document.querySelector(".todoPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/index.html";
	}
	if (document.querySelector(".habitsPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/index.html";
	}
	if (document.querySelector(".goalsPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/index.html";
	}
};

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);
	if (document.querySelector(".loginPage")) {
		new rhit.LoginPageController();
	}
	if (document.querySelector(".homePage")) {
		const uid = urlParams.get("id");
		rhit.fbQuoteManager = new rhit.fbQuoteManager(uid);
		new rhit.HomePageController(uid);
	}
	if (document.querySelector(".todoPage")) {
		const uid = urlParams.get("id");
		rhit.fbTodoManager = new rhit.fbTodoManager(uid);
		console.log("TODO Manager Initialized");
		new rhit.TodoPageController();
	}
	if (document.querySelector(".habitsPage")) {
		const uid = urlParams.get("id");
		rhit.fbHabitsManager = new rhit.fbHabitsManager(uid);
		console.log("HABITS Manager Initialized");
		new rhit.HabitsPageController();
	}
	if (document.querySelector(".goalsPage")) {
		const uid = urlParams.get("id");
		rhit.fbGoalsManager = new rhit.fbGoalsManager(uid);
		console.log("GOALS Manager Initalized");
		new rhit.GoalsPageController();
	}
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
