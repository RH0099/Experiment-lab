const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ক্যামেরা চালু করা
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera Access Denied!", err));

function detectColor() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let length = frame.data.length;

    for (let i = 0; i < length; i += 4) {
        let red = frame.data[i];
        let green = frame.data[i + 1];
        let blue = frame.data[i + 2];

        // নীল রঙ শনাক্তকরণ (Blue Pen Detection)
        if (blue > 150 && red < 100 && green < 100) {
            frame.data[i] = 255; // Red
            frame.data[i + 1] = 0; // Green
            frame.data[i + 2] = 0; // Blue
        }
    }

    ctx.putImageData(frame, 0, 0);
    requestAnimationFrame(detectColor);
}

video.addEventListener('play', detectColor);
