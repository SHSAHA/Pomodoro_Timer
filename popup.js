
var myform = document.getElementById('myform');
var startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', function(e) {
	var workTime = document.querySelectorAll("input[name=work]:checked")[0].value;
	var breakTime = document.querySelectorAll("input[name=break]:checked")[0].value;
	chrome.runtime.sendMessage({
		"work": workTime,
		"break": breakTime
	});
});