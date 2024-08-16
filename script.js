document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
  
    function updateCandleCount() {
      const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
    }
  
    function addCandle(left, top) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";
  
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
  
      cake.appendChild(candle);
      candles.push(candle);
      updateCandleCount();
    }
  
    cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });
  
    function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;
  
      return average > 50; //
    }
  
    function blowOutCandles() {
      let blownOut = 0;
  
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;   
          }
        });
      }
  
      if (blownOut > 0) {
        updateCandleCount();
        changeMessageToHappyBirthday();
        setTimeout(createHearts, 500); 
        setTimeout(createHead, 500); 
      }
    }

    function createHearts() {
        const heartsContainer = document.getElementById('hearts-container');
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heartsContainer.appendChild(heart);
        }
    }

    function createHead() {
      const heartsContainer = document.getElementById('head-container');
      for (let i = 0; i < 20; i++) {
          const heart = document.createElement('div');
          heart.classList.add('head');
          heart.style.left = `${Math.random() * 100}%`;
          heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
          heart.style.animationDelay = `${Math.random() * 5}s`;
          heartsContainer.appendChild(heart);
      }
  }

    function changeMessageToHappyBirthday() {
        // Giả sử bạn có một khung với class là "happy-birthday-frame" và chứa nội dung cần thay đổi
        const messageFrame = document.querySelector(".happy-birthday-frame");
    
        if (messageFrame) {
            messageFrame.textContent = "Happy 20th Birthday Nhumngu! Make a wish!";
        }
    }
  
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  });