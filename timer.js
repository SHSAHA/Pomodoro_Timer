/**
 * called when page loads to initialize the main functions.
 */
function init() {
	addMessageListeners();
	startTimer();
	stopOnClick();
}

/**
 * sends mesage to start the timer.
 */
function startTimer() {
	// sends message to background.js
	chrome.runtime.sendMessage({"ask": "current"},
		function(response) {
			// response callback
			if (response.current === "popup.html") {
				chrome.runtime.sendMessage({"command": "startTimer"});
			};
		});
}

/**
 * updates the time in the timer.html DOM.
 */
function updateTime(timeDifference) {
	pomTimer = document.getElementById('time').innerText = timeDifference;
}

function updateLabel(label) {
	document.getElementById("label").innerHTML = label;
}

/**
 * adds message listener to update the time.
 */
function addMessageListeners() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.command === 'updateTime') {
				updateTime(request.time);
			};

			if (request.update) {
				updateLabel(request.update);
			};
		});
}

function stopOnClick() {
	document.getElementById("stopBtn").addEventListener('click', function(e) {
		chrome.runtime.sendMessage({"command": "stopAll"});
		window.alert(states);
	});
}

document.addEventListener('DOMContentLoaded', init);