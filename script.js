const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let model = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let inkColor = "red";  // প্রাথমিক রঙ

// ক্যামেরা চালু করা
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera Access Denied!", err));

// Hand tracking model লোড
handTrack.load().then(loadedModel => {
    model = loadedModel;
    startTracking();
});

// ✋ হ্যান্ড ট্র্যাকিং ফাংশন
function startTracking() {
    setInterval(() => {
        model.detect(video).then(predictions => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (predictions.length > 0) {
                let finger = predictions[0].bbox;
                let x = finger[0] + finger[2] / 2;
                let y = finger[1] + finger[3] / 2;

                if (!isDrawing) {
                    lastX = x;
                    lastY = y;
                }

                ctx.beginPath();
                ctx.strokeStyle = inkColor;
                ctx.lineWidth = 5;
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();

                lastX = x;
                lastY = y;
                isDrawing = true;
            } else {
                isDrawing = false;
            }
        });
    }, 100);
}

// 🖌️ রঙ পরিবর্তন ফাংশন
document.getElementById('color').addEventListener('click', () => {
    const colors = ["red", "blue", "green", "yellow", "white"];
    inkColor = colors[Math.floor(Math.random() * colors.length)];
});

// 🧹 ক্লিয়ার বোতাম
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 💾 সেভ বোতাম
document.getElementById('save').addEventListener('click', () => {
    let link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = "finger_painting.png";
    link.click();
});
