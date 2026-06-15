// Mock Eel implementation for static browser demo
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
            if (!message) return;
            
            // Generate simulated reply
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
                reply = "Clearing screen.";
                document.querySelector(".siri-message").innerText = "Hello, I am Your Assistant";
                return;
            } else {
                reply = "I received your message: '" + message + "'. This is a local browser demonstration of my interface!";
            }
            
            // Display reply
            const msgEl = document.querySelector(".siri-message");
            if (msgEl) {
                msgEl.innerText = reply;
            }
            
            // Speak reply
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(reply);
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
        };
    }
};
