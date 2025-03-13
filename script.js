const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let recording = false;

// 🎥 ক্যামেরা চালু করা (শুধু একটি স্ক্রিন রাখার জন্য facingMode "environment")
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera Access Denied!", err));

// 🎨 3D ক্যামেরা তৈরি (Three.js ব্যবহার)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// 📸 রেকর্ডিং সাপোর্ট
document.getElementById('record').addEventListener('click', () => {
    recording = !recording;
    if (recording) {
        alert("🎥 রেকর্ডিং শুরু!");
    } else {
        alert("🛑 রেকর্ডিং বন্ধ!");
    }
});

// 💾 প্রজেক্ট সেভ (লোকাল স্টোরেজ)
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

// 🔄 রিস্টোর প্রজেক্ট
document.getElementById('restore').addEventListener('click', () => {
    let savedImage = localStorage.getItem("savedProject");
    if (savedImage) {
        let img = new Image();
        img.src = savedImage;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        alert("🔄 প্রজেক্ট রিস্টোর হয়েছে!");
    } else {
        alert("⚠️ কোন প্রজেক্ট সেভ নেই!");
    }
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
