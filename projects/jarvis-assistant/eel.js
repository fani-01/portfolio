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
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greetings")) {
        reply = "Hello! I am Jarvis. How can I assist you today?";
    } else if (msg.includes("how are you") || msg.includes("how's it going") || msg.includes("how is it going") || msg.includes("are you fine") || msg.includes("how do you do")) {
        reply = "I am functioning at peak efficiency and all core systems are stable. Thank you for asking!";
    } else if (msg.includes("who created you") || msg.includes("who built you") || msg.includes("who made you") || msg.includes("who is your developer") || msg.includes("who is your creator") || msg.includes("fani") || msg.includes("chinta") || msg.includes("creator") || msg.includes("developer") || msg.includes("author")) {
        reply = "I was created by Chinta Phanith Kumar (also known as Fani), an expert AI and Machine Learning specialist who built this entire portfolio!";
    } else if (msg.includes("who are you") || msg.includes("what is your name") || msg.includes("your name") || msg.includes("what are you")) {
        reply = "I am Jarvis, a virtual holographic assistant UI designed to showcase Fani's projects and technical achievements.";
    } else if (msg.includes("what can you do") || msg.includes("what are your capabilities") || msg.includes("help") || msg.includes("features") || msg.includes("what do you do")) {
        reply = "I can tell you about Fani's projects (YOLOv8, Federated Learning, VQA), his technical skills, or his work experience. Try asking: 'What projects did Fani build?'";
    } else if (msg.includes("projects") || msg.includes("project") || msg.includes("what did you build") || msg.includes("work") || msg.includes("portfolio")) {
        reply = "Fani has built several advanced projects: 1) Privacy-Preserving Federated Learning, 2) YOLOv8 Object Detection, 3) Visual Question Answering, and 4) this Jarvis AI Assistant page! Ask me about any of them.";
    } else if (msg.includes("federated learning") || msg.includes("privacy") || msg.includes("financial") || msg.includes("transaction")) {
        reply = "The Federated Learning project analyzes financial transactions securely across decentralized nodes while fully protecting user privacy. It's a key highlight of Fani's ML research!";
    } else if (msg.includes("yolo") || msg.includes("object detection") || msg.includes("pedestrian") || msg.includes("vehicle")) {
        reply = "The YOLOv8 Object Detection project simulates real-time vehicle and pedestrian tracking with high accuracy. Fani has built a simulated dashboard demo for it.";
    } else if (msg.includes("vqa") || msg.includes("visual question") || msg.includes("attention") || msg.includes("heatmap")) {
        reply = "The Visual Question Answering project uses attention heatmaps to explain where the neural network is looking inside an image when answering questions about it.";
    } else if (msg.includes("skills") || msg.includes("languages") || msg.includes("arsenal") || msg.includes("technologies") || msg.includes("python")) {
        reply = "Fani is highly proficient in Python, Deep Learning, TensorFlow, PyTorch, YOLOv8, and web development (HTML, CSS, JS). He has a very strong technical arsenal!";
    } else if (msg.includes("experience") || msg.includes("intern") || msg.includes("internship") || msg.includes("smart internz") || msg.includes("edunet") || msg.includes("aimer")) {
        reply = "Fani completed Deep Learning and AI/ML internships at Smart Internz, Edunet Foundation (AICTE), and AIMER Society, working on translators, quality detection, and AI documentation.";
    } else if (msg.includes("time") || msg.includes("what is the time") || msg.includes("clock")) {
        reply = "The current system time is " + new Date().toLocaleTimeString() + ". All auxiliary registers are operational.";
    } else if (msg.includes("weekend") || msg.includes("week end") || msg.includes("plan")) {
        reply = "For your weekend, I highly recommend exploring Fani's interactive projects: try the YOLOv8 Object Detection dashboard, or the Federated Learning dashboard! For an offline plan, how about grabbing a coffee, relaxing, and enjoying a walk outdoors?";
    } else if (msg.includes("joke") || msg.includes("laugh") || msg.includes("funny")) {
        reply = "Why did the neural network go to therapy? It had too many hidden layers! Or this: Why do programmers wear glasses? Because they can't C#!";
    } else if (msg.includes("weather") || msg.includes("temperature")) {
        reply = "Fani's local workspace climate is highly productive, and my CPU temperature is stable at 42 degrees Celsius. Expect high chances of innovative coding this weekend!";
    } else if (msg.includes("clear") || msg.includes("reset") || msg.includes("wipe")) {
        reply = "Hello, I am Your Assistant";
        if (msgEl) msgEl.innerText = reply;
        const chatLog = document.getElementById("chat-log");
        if (chatLog) chatLog.innerHTML = "";
        return;
    } else {
        reply = "I'm not sure how to answer that, but I can help you navigate Fani's portfolio! Ask me about his projects, skills, or experience (e.g., 'What projects did Fani build?').";
    }
    
    // Display reply text in visualizer
    if (msgEl) {
        msgEl.innerText = reply;
    }
    
    // Append reply to chat log
    appendBotMessage(reply);
    
    // Speak reply
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
