// Mock Eel implementation for static browser demo with real Speech Recognition and Synthesis
window.eel = {
    init: function() {
        return function() {
            console.log("Mock Jarvis Initialized");
        };
    },
    play_assistant_sound: function() {
        console.log("Playing assistant sound");
    },
    takeAllCommands: function(message) {
        return function() {
            console.log("Command received:", message);
            const msgEl = document.querySelector(".siri-message");
            
            // 1. If no message is provided, trigger Web Speech Recognition
            if (!message) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                    const fallbackMsg = "Speech recognition is not supported in this browser. Please type your message.";
                    if (msgEl) msgEl.innerText = fallbackMsg;
                    speakText(fallbackMsg);
                    return;
                }
                
                if (msgEl) msgEl.innerText = "Listening...";
                
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                
                recognition.onresult = function(event) {
                    const speechToText = event.results[0][0].transcript;
                    console.log("Speech recognized:", speechToText);
                    if (msgEl) msgEl.innerText = 'You said: "' + speechToText + '"';
                    
                    // Run command processing on the recognized speech after 1 second
                    setTimeout(() => {
                        processCommand(speechToText, msgEl);
                    }, 1000);
                };
                
                recognition.onerror = function(event) {
                    console.error("Speech recognition error:", event.error);
                    if (msgEl) msgEl.innerText = "Sorry, I couldn't hear you. Please try again.";
                };
                
                recognition.start();
                return;
            }
            
            // 2. If message is provided, process it immediately
            processCommand(message, msgEl);
        };
    }
};

function processCommand(message, msgEl) {
    let reply = "";
    const msg = message.toLowerCase();
    
    if (msg.includes("hello") || msg.includes("hi")) {
        reply = "Hello! I am Jarvis, how can I help you today?";
    } else if (msg.includes("who are you") || msg.includes("what is your name")) {
        reply = "I am Jarvis, a virtual assistant UI designed by Chinta Phanith Kumar.";
    } else if (msg.includes("chinta") || msg.includes("author") || msg.includes("creator")) {
        reply = "Chinta Phanith Kumar is an expert AI and Machine Learning graduate. He built this portfolio and my interface!";
    } else if (msg.includes("skills") || msg.includes("experience")) {
        reply = "Chinta has strong skills in Deep Learning, Computer Vision, and Federated Learning. You can view his resume on the portfolio!";
    } else if (msg.includes("clear") || msg.includes("reset")) {
        reply = "Hello, I am Your Assistant";
        if (msgEl) msgEl.innerText = reply;
        return;
    } else {
        reply = "I received your command: '" + message + "'. This is a local browser demonstration of my interface!";
    }
    
    // Display reply
    if (msgEl) {
        msgEl.innerText = reply;
    }
    
    // Speak reply
    speakText(reply);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        
        // Try to find a male/Jarvis-like voice
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => v.name.includes("Male") || v.name.includes("Google US English") || v.name.includes("Microsoft David"));
        if (maleVoice) {
            utterance.voice = maleVoice;
        }
        window.speechSynthesis.speak(utterance);
    }
}
