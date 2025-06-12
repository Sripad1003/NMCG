const chatbotTogglerdocument = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const sendChatBtn = document.querySelector(".chat-input span");
const showImg = document.querySelector('.chacha-animation');
const chatInput = document.querySelector(".chat-input textarea");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get references to the voice input button and the chat input textarea
const voiceInputBtn = document.getElementById("voice-input-btn");

// Function to handle voice input
const handleVoiceInput = () => {
    // Check if the browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Create a new instance of SpeechRecognition
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        // Initialize microphone button state
        let isMicOn = false;

        // Function to toggle microphone state
        const toggleMic = () => {
            isMicOn = !isMicOn;
            if (isMicOn) {
                voiceInputBtn.classList.remove('muted');
                voiceInputBtn.innerHTML = "mic";
                recognition.start(); // Start speech recognition
            } else {
                voiceInputBtn.classList.add('muted');
                voiceInputBtn.innerHTML = "mic_off";
                recognition.stop(); // Stop speech recognition
            }
        };

        // Event listener for voice input button
        voiceInputBtn.addEventListener("click", () => {
            toggleMic();
        });

        // Event listener for when speech is recognized
        recognition.onresult = (event) => {
            // Get the recognized text from the event
            const recognizedText = event.results[0][0].transcript;
            // Update chat input field with the recognized text
            chatInput.value = recognizedText;
            toggleMic(); // Toggle microphone state after recognition
        };

        // Event listener for error handling
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            toggleMic(); // Toggle microphone state on error
        };
    } else {
        // If speech recognition is not supported, log an error message
        voiceInputBtn.classList.add('muted');
        voiceInputBtn.innerHTML = "mic_off";
        console.error('Speech recognition not supported.');
    }
};

// Event listener for voice input button
voiceInputBtn.addEventListener("click", handleVoiceInput);

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    function sendPostRequest(userMessage) {
        const url = "/webhook";
        const data = JSON.stringify({ message: userMessage });

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        })
            .then((response) => response.json())
            .then((data) => {
                let botResponse = data.response;
                messageElement.textContent = botResponse
                // Append bot's response to the chatbox
                // const chatMessages = document.getElementById("chat-widget-messages");
                // chatMessages.innerHTML += `<div><strong>Bot: </strong>${botResponse}</div>`;
            })
            .catch((error) => {
                messageElement.classList.add("error");
                messageElement.textContent = "Oops! Something went wrong. Please try again.";
            }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }

    sendPostRequest(userMessage)
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(async () => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        await sleep(1200);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
document.body.classList.add("show-chatbot");
showImg.style.opacity = 1;
showImg.style.transform = 'none';

const quotes = [
    "A clean river is a reflection of a pure heart.",
    "Let every drop in the river carry the promise of a cleaner tomorrow.",
    "Healing the Ganga starts with cleaning our own habits.",
    "Rivers are the veins of our planet; cleaning them is essential for life.",
    "To purify the Ganga, we must cleanse our actions.",
    "Each piece of litter removed from the river is a step towards renewal.",
    "Ganga's purity lies in the hands that protect it.",
    "Cleaning the Ganga is not a choice; it's a responsibility.",
    "Water pollution in the Ganga is a silent scream for our attention.",
    "Let the waves of change begin with cleaning the Ganga.",
    "A river's beauty lies in its untarnished flow.",
    "Rivers should inspire poetry, not pollution.",
    "The Ganga's song should be of purity, not pollution.",
    "In the pursuit of clean water, we find the essence of life.",
    "Preserving the Ganga is preserving the soul of our nation.",
    "A clean Ganga is a legacy we owe to future generations.",
    "Water pollution is a stain on the canvas of the Ganga's beauty.",
    "Rivers connect us all; let's unite to keep them clean.",
    "Ganga deserves our respect, not pollution.",
    "Clean rivers are the lifelines of a healthy planet.",
    "To cleanse the Ganga, we must cleanse our hearts.",
    "The Ganga flows through us; let's not tarnish its journey.",
    "Polluting the river is poisoning our own well of life.",
    "Clean water is not just a necessity; it's a right.",
    "Protecting the Ganga is a pledge for the planet.",
    "Ganga's sanctity is in our hands; let's not wash it away.",
    "The river whispers the secrets of a cleaner world; let's listen.",
    "Ganga's charm lies in its clarity, not in its contamination.",
    "In cleaning rivers, we wash away the sins against nature.",
    "Water pollution in the Ganga is a reflection of our collective neglect.",
    "A pristine Ganga is a testament to our commitment to nature.",
    "Rivers should carry dreams, not debris.",
    "To dirty the Ganga is to tarnish the soul of our nation.",
    "Let's be the guardians of the Ganga's purity.",
    "Polluting the river is polluting our shared heritage.",
    "Clean water is a birthright; let's not steal it from future generations.",
    "A pure Ganga is the heartbeat of a thriving ecosystem.",
    "Rivers teach us the art of renewal; let's reciprocate the lesson.",
    "To clean the Ganga is to cleanse our conscience.",
    "Ganga's tears are the pollution; let's wipe them away.",
    "Rivers unite us; pollution divides us.",
    "The Ganga deserves to dance freely, unburdened by pollution.",
    "Water pollution is a crime against the Ganga's grace.",
    "In protecting the Ganga, we protect the essence of life.",
    "To heal the Ganga is to heal our relationship with nature.",
    "Every action against water pollution is a ripple of change.",
    "Ganga's flow should carry hope, not pollutants.",
    "Let's not drown the Ganga in our negligence.",
    "Clean rivers are the veins of a healthy ecosystem.",
    "Ganga's purity is a reflection of our commitment to the environment."
];



function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return "\" " + quotes[randomIndex] + " \"";
}
document.getElementById("quote").innerHTML = getRandomQuote();