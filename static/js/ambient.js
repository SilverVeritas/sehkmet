document.addEventListener("DOMContentLoaded", function() {

    // Get all the volume sliders
    let sliders = document.querySelectorAll(".volume-slider");

    sliders.forEach(function(slider) {
        // Get the associated audio element for this slider
        let audio = slider.closest('.ambient-sound').querySelector('audio');

        // Event listener for slider change
        slider.addEventListener("input", function() {
            // Set the audio volume based on the slider value
            audio.volume = slider.value;
            
            // If slider is above 0 and audio is not playing, play it
            if(slider.value > 0 && audio.paused) {
                audio.play();
            }
            // If slider is 0, pause the audio
            else if(slider.value == 0) {
                audio.pause();
            }
        });
    });
});
