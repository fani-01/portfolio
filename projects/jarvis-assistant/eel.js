// Mock Eel implementation for static browser demo with real Speech Recognition, Speech Synthesis, and Chat History bubbles
window.eel = {
    init: function() {
        return function() {
            console.log("Mock Jarvis Initialized");
            
            // Speak intro: "Hi, I am Jarvis, created by Fani. How can I help you?"
            const welcomeMsg = "Hi, I am Jarvis, created by Fani. How can I help you?";
            
            // Set message on siri subtitle
            const msgEl = document.querySelector(".siri-message");
            if (msgEl) msgEl.innerText = welcomeMsg;
            
            // Show SiriWave wrapper briefly for intro
            const siriWrapper = document.getElementById("siri-wave-wrapper");
            if (siriWrapper) siriWrapper.style.display = "block";
            
            // Append welcome message to chat log (exactly once at start)
            appendBotMessage(welcomeMsg);
            
            // Speak the welcome message
            speakText(welcomeMsg);
            
            // Hide SiriWave wrapper after speaking (simulated timeout)
            setTimeout(() => {
                if (siriWrapper) siriWrapper.style.display = "none";
            }, 4000);
        };
    },
    play_assistant_sound: function() {
        console.log("Playing assistant sound");
    },
    takeAllCommands: function(message) {
        return function() {
            console.log("Command received:", message);
            const msgEl = document.querySelector(".siri-message");
            
            // 1. If no message is provided, trigger Web Speech Recognition (microphone clicked)
            if (!message) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    const fallbackMsg = "Speech recognition is not supported in this browser. Please type your message.";
                    if (msgEl) msgEl.innerText = fallbackMsg;
                    appendBotMessage(fallbackMsg);
                    speakText(fallbackMsg);
                    return;
                }
                
                try {
                    if (msgEl) msgEl.innerText = "Listening...";
                    const siriWrapper = document.getElementById("siri-wave-wrapper");
                    if (siriWrapper) siriWrapper.style.display = "block";
                    
                    const recognition = new SpeechRecognition();
                    recognition.lang = 'en-US';
                    recognition.interimResults = false;
                    
                    recognition.onresult = function(event) {
                        const speechToText = event.results[0][0].transcript;
                        console.log("Speech recognized:", speechToText);
                        
                        if (msgEl) msgEl.innerText = 'You said: "' + speechToText + '"';
                        
                        // Append user prompt to chat log
                        appendUserMessage(speechToText);
                        
                        // Process recognized command after a short delay
                        setTimeout(() => {
                            processCommand(speechToText, msgEl);
                        }, 1000);
                    };
                    
                    recognition.onerror = function(event) {
                        console.error("Speech recognition error:", event.error);
                        if (event.error === 'not-allowed') {
                            if (msgEl) msgEl.innerText = "Microphone access blocked. Please enable it in browser settings.";
                        } else {
                            if (msgEl) msgEl.innerText = "Sorry, I couldn't hear you. Please try again.";
                        }
                        setTimeout(() => {
                            if (siriWrapper) siriWrapper.style.display = "none";
                        }, 3000);
                    };
                    
                    recognition.start();
                } catch (err) {
                    console.error("Failed to start SpeechRecognition:", err);
                    if (msgEl) msgEl.innerText = "Failed to initialize microphone connection.";
                }
                return;
            }
            
            // 2. If message is provided, process it immediately (user typed)
            processCommand(message, msgEl);
        };
    }
};

function appendUserMessage(text) {
    const chatLog = document.getElementById("chat-log");
    if (chatLog) {
        const userDiv = document.createElement("div");
        userDiv.className = "width-size align-self-end text-end mb-2 ms-auto";
        userDiv.innerHTML = `<div class="sender_message">${text}</div>`;
        chatLog.appendChild(userDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}

function appendBotMessage(text) {
    const chatLog = document.getElementById("chat-log");
    if (chatLog) {
        const botDiv = document.createElement("div");
        botDiv.className = "width-size align-self-start text-start mb-2";
        botDiv.innerHTML = `<div class="receiver_message">${text}</div>`;
        chatLog.appendChild(botDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}

function processCommand(message, msgEl) {
    let reply = "";
    const msg = message.toLowerCase().trim();
    
    if (msg.includes("hello") || msg.includes("hi")) {
        reply = "Hello! I am Jarvis, how can I help you today?";
    } else if (msg.includes("who are you") || msg.includes("what is your name")) {
        reply = "I am Jarvis, a virtual assistant UI designed by Chinta Phanith Kumar (Fani).";
    } else if (msg.includes("fani") || msg.includes("chinta") || msg.includes("author") || msg.includes("creator")) {
        reply = "Chinta Phanith Kumar (Fani) is an expert AI and Machine Learning graduate. He built this portfolio and my interface!";
    } else if (msg.includes("skills") || msg.includes("experience")) {
        reply = "Fani has strong skills in Deep Learning, YOLOv8 Object Detection, and Federated Learning. You can view his resume on the portfolio!";
    } else if (msg.includes("clear") || msg.includes("reset")) {
        reply = "Hello, I am Your Assistant";
        if (msgEl) msgEl.innerText = reply;
        const chatLog = document.getElementById("chat-log");
        if (chatLog) chatLog.innerHTML = "";
        return;
    } else {
        reply = "I'm not sure how to answer that, but I can help you navigate Fani's portfolio! Ask me about his projects, skills, or experience.";
    }
    
    // Display reply text in visualizer
    if (msgEl) {
        msgEl.innerText = reply;
    }
    
    // Append reply to chat log
    appendBotMessage(reply);
    
    // Speak reply (never plays the welcome intro here, only standard responses)
    speakText(reply);
    
    // Hide SiriWave visualizer after speech completes (estimate 4 seconds)
    setTimeout(() => {
        const siriWrapper = document.getElementById("siri-wave-wrapper");
        if (siriWrapper) siriWrapper.style.display = "none";
    }, 4000);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.0;
        utterance.rate = 1.05; // Natural speed
        
        const doSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            // Try to find a male/Jarvis-like voice
            const maleVoice = voices.find(v => 
                v.name.includes("Male") || 
                v.name.includes("Google US English") || 
                v.name.includes("Microsoft David") || 
                v.name.includes("Natural")
            );
            if (maleVoice) {
                utterance.voice = maleVoice;
            }
            window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = doSpeak;
        } else {
            doSpeak();
        }
    }
}
