// Global Variables
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let analyser;
let canvas;
let canvasContext;
let bufferLength;
let dataArray;
let filterNode; // For the band-pass filter to adjust the pitch
let noiseSource;
let gainNode;

function startAudioAndVisual() {
    // Initialize audio context
    audioContext = new AudioContext();

    // Create noise source and fill it with white noise
    noiseSource = audioContext.createBufferSource();
    const bufferSize = audioContext.sampleRate; // 1 second of sound
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Generate white noise
    }

    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Set up the filter node (band-pass filter) and set initial frequency
    filterNode = audioContext.createBiquadFilter();
    filterNode.type = "bandpass";
    filterNode.frequency.value = 1000; // Initial frequency
    filterNode.Q.value = 1; // Quality factor

    // Set up gain node (volume control)
    gainNode = audioContext.createGain();

    // Connect nodes
    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Visualization setup
    analyser = audioContext.createAnalyser();
    noiseSource.connect(analyser);
    canvas = document.getElementById("audioVisualizer");
    canvasContext = canvas.getContext("2d");
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = "#000";
        canvasContext.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasContext.lineTo(canvas.width, canvas.height / 2);
        canvasContext.stroke();
    }

    // Start the visualization and white noise audio
    draw();
    noiseSource.start();
}

// For Step 3: Adjust the volume of the white noise audio
function adjustVolume() {
    if (gainNode) {
        const volumeSlider = document.getElementById('volumeSlider');
        gainNode.gain.value = volumeSlider.value;
        localStorage.setItem('whiteNoiseVolume', volumeSlider.value); // Save volume to localStorage
    }
}

// In the startWhiteNoise function, after checking localStorage
// Adjust initial volume based on the slider's initial value
const volumeSlider = document.getElementById('volumeSlider');
if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
    gainNode.gain.value = savedVolume;
} else {
    volumeSlider.value = 0.5; // Set to the median value if not found in localStorage
    adjustVolume(); // Adjust initial volume based on the slider's initial value
}


// For Step 4: Adjust the pitch of the white noise audio
function adjustPitch() {
    if (filterNode) {
        const pitchSlider = document.getElementById('pitchSlider');
        if (pitchSlider) {
            const currentFrequency = document.getElementById('currentFrequency');
            const frequencyValue = pitchSlider.value;
            filterNode.frequency.value = frequencyValue;
            currentFrequency.textContent = frequencyValue + ' Hz'; // Update the display
            localStorage.setItem('whiteNoisePitch', frequencyValue); // Save pitch to localStorage
        }
    }
}


// In the startWhiteNoise function, after checking localStorage
// Adjust initial pitch based on the slider's initial value
const pitchSlider = document.getElementById('pitchSlider');
if (savedPitch !== null) {
    pitchSlider.value = savedPitch;
    filterNode.frequency.value = savedPitch;
} else {
    pitchSlider.value = 9000; // Set to the median value if not found in localStorage
    adjustPitch(); // Adjust initial pitch based on the slider's initial value
}

// Additional Step 4 functions for "Lower", "Medium", and "Higher" pitch presets
function setLowerPitch() {
    filterNode.frequency.value = 3000; // Mid-point of 0 - 6000Hz
    localStorage.setItem('whiteNoisePitch', 3000); // Save pitch to localStorage
}

function setMediumPitch() {
    filterNode.frequency.value = 9000; // Mid-point of 6000 - 12000Hz
    localStorage.setItem('whiteNoisePitch', 9000); // Save pitch to localStorage
}

function setHigherPitch() {
    filterNode.frequency.value = 15000; // Mid-point of 12000 - 18000Hz
    localStorage.setItem('whiteNoisePitch', 15000); // Save pitch to localStorage
}

function startWhiteNoise() {
    audioContext = new AudioContext();
    noiseSource = audioContext.createBufferSource();
    filterNode = audioContext.createBiquadFilter();
    gainNode = audioContext.createGain();

    const bufferSize = audioContext.sampleRate; // 1 second of sound
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    filterNode.type = "bandpass";
    filterNode.frequency.value = 1000; // You can adjust this frequency

    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Connect the nodes
    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Initialize volume to the median value
    const savedVolume = localStorage.getItem('whiteNoiseVolume');
    if (savedVolume !== null) {
        gainNode.gain.value = savedVolume;
        if (document.getElementById('volumeSlider')) {
            document.getElementById('volumeSlider').value = savedVolume;
        }
    } else {
        // Calculate and set the median value for volume
        const minVolume = parseFloat(document.getElementById('volumeSlider').min);
        const maxVolume = parseFloat(document.getElementById('volumeSlider').max);
        const medianVolume = (minVolume + maxVolume) / 2;
        gainNode.gain.value = medianVolume;
        adjustVolume(); // Adjust initial volume based on the slider's initial value
    }

    noiseSource.start();

    // Adjust initial volume based on the slider's initial value
    adjustVolume();
}

function adjustPitch() {
    if (filterNode) {
        const pitchSlider = document.getElementById('pitchSlider');
        if (pitchSlider) {
            const currentFrequency = document.getElementById('currentFrequency');
            const frequencyValue = pitchSlider.value;
            filterNode.frequency.value = frequencyValue;
            currentFrequency.textContent = frequencyValue + ' Hz'; // Update the display
            localStorage.setItem('whiteNoisePitch', frequencyValue); // Save pitch to localStorage
        }
    }
}

function setPitchRange(min, max) {
    if (filterNode) {
        const newPitch = (min + max) / 2;
        filterNode.frequency.value = newPitch;
        document.getElementById('pitchSlider').value = newPitch;
        localStorage.setItem('whiteNoisePitch', newPitch);
        updateCurrentFrequency(); // Update the current frequency display
    }
}

// Add this function to update the current frequency display
function updateCurrentFrequency() {
    const pitchSlider = document.getElementById('pitchSlider');
    const currentFrequency = document.getElementById('currentFrequency');
    if (pitchSlider && currentFrequency) {
        const frequencyValue = pitchSlider.value;
        currentFrequency.textContent = frequencyValue + ' Hz';
    }
}


