navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const average = array.reduce((a, b) => a + b) / array.length;
            if (average > 50) { // Adjust this value based on your environment
                document.getElementById('flame').style.display = 'none';
            }
        };
    })
    .catch(function(err) {
        console.error('Error accessing microphone:', err);
    });
