/**
 * background.js is the mainly the controller while the other files
 * are there to send and recieve messages (for the most part).
 */

// states change depending on if working or break and current popup page
var states = {
	pomodoro: false,
	break: false,
	current: "popup.html"
}

// holds the time for work period and break period
var workTime;
var breakTime;

/**
 * listens for startTimer message from timer.js
 * and listens for work and break times message sent from popup.js
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if (request.ask === "current") {
			sendResponse({"current": states.current})
		};

		if (request.command === 'startTimer' && !states.pomodoro) {
			startTimer();
			sendResponse({"message": "Timer started"});
		} else if (request.command === "stopAll") {
			stopAll();
		};

		if (request.work && request.break) {
			workTime = request.work;
			breakTime = request.break;
		};
	}
);

/**
 * stop the pomodoro completely
 */
function stopAll() {
	states.pomodoro = false;
	states.break = false;
	states.current = "popup.html";
	chrome.browserAction.setPopup({popup: "popup.html"});
}

/**
 * starts the timer and updates the timer in the DOM every second.
 */
function startTimer() {
	var time = moment();
	states.pomodoro = true;
	states.break = true;
	states.current = "timer.html";

	chrome.runtime.sendMessage({"update": "WORK!"})
	chrome.browserAction.setPopup({popup: "timer.html"});

	var timer = setInterval(function() {
		var diff = moment().diff(time, 'seconds');
		if (diff >= workTime || !states.pomodoro) {
			clearInterval(timer);
			states.pomodoro = false;
			if(states.break) {
				startBreak();
				notifyUser("Time for a break!!");
			};
		};
		sendUpdatedTime(diff);
	}, 1000);
}

function startBreak() {
	var time = moment();
	chrome.runtime.sendMessage({"update": "BREAK!"})

	var timer = setInterval(function() {
		var diff = moment().diff(time, 'seconds');
		if (diff >= breakTime || !states.break) {
			clearInterval(timer);
			if(states.break){
				notifyUser("Break over!");
			};
			chrome.browserAction.setPopup({popup: "popup.html"});
			states.break = false;
			states.current = "popup.html";
			return;
		}
		sendUpdatedTime(diff);
	}, 1000)
}

/**
 * sends message to update the time by timeDifference
 */
function sendUpdatedTime(diff) {
	var time = moment().startOf("day").seconds(diff).format("m:ss");
	chrome.runtime.sendMessage({
		"command": "updateTime",
		"time": time
	});
}

/**
 * sends a chrome notification when time is up.
 */
function notifyUser(msg) {
	var opts = {
		"type": "basic",
		"title": "Break Time!",
		"message": msg,
		"iconUrl": "icon.png"
	};
	var id = "pomodoro" + (new Date().getTime());
	chrome.notifications.create(id, opts);
};