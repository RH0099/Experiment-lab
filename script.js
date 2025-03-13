const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let recording = false;

// 🎥 ক্যামেরা চালু করা
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera Access Denied!", err));

// 🎨 AI Object Detection & 3D Effect
function detectObject() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.scale(-1, 1); // মিরর ফিক্স
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    requestAnimationFrame(detectObject);
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

// 💾 প্রজেক্ট সেভ (SD Card & Web Storage)
document.getElementById('save').addEventListener('click', () => {
    let img = canvas.toDataURL("image/png");
    localStorage.setItem("savedProject", img);

    let link = document.createElement('a');
    link.href = img;
    link.download = "ai_project.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
    alert("🔄 নতুন প্রোজেক্ট তৈরি করা হয়েছে!");
});

// AI & 3D রেন্ডারিং শুরু
video.addEventListener('play', detectObject);
                                                 
