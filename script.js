const experiments = {
    "গ্লাসের মধ্যে পানি ও লবণ": "লবণ দ্রবীভূত হয়ে নুনের দ্রবণ তৈরি হয়।",
    "গরম পানিতে বরফ দিলে কি হয়": "বরফ দ্রুত গলে যায়।",
    "কোকা-কোলা ও মেন্টস মেশালে কি হয়": "বিস্ফোরণ হয়, কারণ CO₂ গ্যাস বেরিয়ে আসে।",
    "লোহা ও চুম্বকের বিক্রিয়া": "লোহা চুম্বকের আকর্ষণে আটকে যায়।",
    "ডিমকে ভিনেগারে রাখলে কি হয়": "ডিমের খোসা নরম হয়ে যায়।"
};

// 🔍 অটো-সাজেশন ফিচার
function showSuggestions() {
    let query = document.getElementById("searchBox").value.toLowerCase();
    let suggestionBox = document.getElementById("suggestions");
    suggestionBox.innerHTML = "";

    for (let key in experiments) {
        if (key.toLowerCase().includes(query) && query !== "") {
            let suggestionItem = document.createElement("li");
            suggestionItem.innerText = key;
            suggestionItem.onclick = function() {
                document.getElementById("searchBox").value = key;
                suggestionBox.innerHTML = "";
            };
            suggestionBox.appendChild(suggestionItem);
        }
    }
}

// 🤖 AI ইন্টিগ্রেশন (GPT API থেকে তথ্য আনা)
async function getAIResponse(query) {
    const apiKey = "YOUR_OPENAI_API_KEY"; // আপনার OpenAI API Key দিন
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Explain the scientific experiment: ${query}`,
            max_tokens: 100
        })
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

// 🔎 এক্সপেরিমেন্ট সার্চ
async function searchExperiment() {
    let query = document.getElementById("searchBox").value;
    let resultDiv = document.getElementById("result");

    if (query in experiments) {
        resultDiv.innerHTML = `<strong>রেজাল্ট:</strong> ${experiments[query]}`;
    } else {
        resultDiv.innerHTML = `<strong>AI চিন্তা করছে...</strong>`;
        let aiResult = await getAIResponse(query);
        resultDiv.innerHTML = `<strong>AI রেজাল্ট:</strong> ${aiResult}`;
        experiments[query] = aiResult; // নতুন তথ্য স্টোর করছে
    }
}

// 🎙️ ভয়েস সার্চ ফিচার
function startVoiceSearch() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.start();

    recognition.onresult = function(event) {
        const voiceText = event.results[0][0].transcript;
        document.getElementById("searchBox").value = voiceText;
        searchExperiment();
    };
}

