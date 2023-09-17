// therapy.js

// Function to start the timer
function startTimer(duration, display) {
    let timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

// Start the timer when the page loads
window.onload = function () {
    const threeHours = 3 * 60 * 60; // 3 hours in seconds
    const timerDisplay = document.getElementById("timer");

    startTimer(threeHours, timerDisplay);
};

// Add your other JavaScript code for audio treatment here
