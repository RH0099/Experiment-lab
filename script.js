const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const virtualCanvas = document.getElementById('virtualCanvas');
const vCtx = virtualCanvas.getContext('2d');

let recording = false;

// 🎥 ক্যামেরা স্ট্রিম চালু
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera Access Denied!", err));

// 🎨 AI Object Detection ও ভার্চুয়াল 3D ডিজাইন
function detectObject() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    virtualCanvas.width = video.videoWidth;
    virtualCanvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let length = frame.data.length;

    for (let i = 0; i < length; i += 4) {
        let red = frame.data[i];
        let green = frame.data[i + 1];
        let blue = frame.data[i + 2];

        // 🔵 নীল রঙ শনাক্তকরণ (Blue Object Tracking)
        if (blue > 150 && red < 100 && green < 100) {
            frame.data[i] = 255; // Red
            frame.data[i + 1] = 0;
            frame.data[i + 2] = 0;
        }
    }
    
    ctx.putImageData(frame, 0, 0);
    render3D();
    requestAnimationFrame(detectObject);
}

// 🏗️ ভার্চুয়াল 3D ডিজাইন
function render3D() {
    vCtx.clearRect(0, 0, virtualCanvas.width, virtualCanvas.height);
    vCtx.fillStyle = "rgba(0, 255, 0, 0.5)";
    vCtx.fillRect(150, 100, 200, 200);
}

// 📸 রেকর্ডিং সাপোর্ট
document.getElementById('record').addEventListener('click', () => {
    recording = !recording;
    if (recording) {
        alert("🎥 রেকর্ডিং শুরু!");
    } else {
        alert("🛑 রেকর্ডিং বন্ধ!");
    }
});

// 💾 প্রজেক্ট সেভ
document.getElementById('save').addEventListener('click', () => {
    let img = canvas.toDataURL("image/png");
    localStorage.setItem("savedProject", img);
    alert("✅ প্রজেক্ট সেভ হয়েছে!");
});

// ⬇️ ডাউনলোড
document.getElementById('download').addEventListener('click', () => {
    let link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = "ai_project.png";
    link.click();
});

// 🆕 নতুন প্রোজেক্ট তৈরি
document.getElementById('new').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vCtx.clearRect(0, 0, virtualCanvas.width, virtualCanvas.height);
    alert("🔄 নতুন প্রোজেক্ট তৈরি করা হয়েছে!");
});

// AI & 3D রেন্ডারিং শুরু
video.addEventListener('play', detectObject);
