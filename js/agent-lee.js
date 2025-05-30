/**
 * Agent Lee - Interactive AI Guide for Always Trucking & Loading LLC
 * This script provides the functionality for the Agent Lee assistant
 * that helps users navigate the training platform.
 */

// Initialize Agent Lee when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAgentLee();
});

/**
 * Initialize Agent Lee by creating the UI and setting up event listeners
 */
function initAgentLee() {
    // Create Agent Lee UI
    createAgentLeeUI();
    
    // Initialize speech synthesis
    initSpeechSynthesis();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add page-specific greetings
    addPageSpecificGreeting();
    
    // Make Agent Lee float anywhere on the screen
    makeAgentLeeFloatable();
}

/**
 * Create the Agent Lee UI elements and append to the document
 */
function createAgentLeeUI() {
    // Create Agent Lee card element
    const agentCard = document.createElement('div');
    agentCard.id = 'agent-lee-card';
    agentCard.className = 'agent-lee-card';
    
    // Add HTML content for Agent Lee
    agentCard.innerHTML = `
        <!-- Card Header -->
        <div class="agent-header" id="agent-drag-handle">
            <div class="agent-avatar">👩‍🏫</div>
            <div class="agent-details">
                <h3>Agent Lee</h3>
                <p>Your Trucking Training Guide</p>
            </div>
            <div class="agent-toggle">
                <button id="agent-minimize">_</button>
            </div>
        </div>
        
        <!-- Navigation Grid -->
        <div class="agent-navigation-grid">
            <button class="agent-nav-button" data-page="index.html">
                <span>🏠</span>
                Home
            </button>
            <button class="agent-nav-button" data-page="courses.html">
                <span>📚</span>
                Courses
            </button>
            <button class="agent-nav-button" data-page="dashboard.html">
                <span>📊</span>
                Dashboard
            </button>
            <button class="agent-nav-button" data-page="login.html">
                <span>🔑</span>
                Login
            </button>
            <button class="agent-nav-button" data-page="register.html">
                <span>✏️</span>
                Register
            </button>
            <button class="agent-nav-button" data-page="quiz.html">
                <span>❓</span>
                Quiz
            </button>
            <button class="agent-nav-button" data-page="faq.html">
                <span>📋</span>
                FAQ
            </button>
        </div>
        
        <!-- Chat Area -->
        <div class="agent-chat-area" id="agent-chat-messages">
            <div class="agent-empty-chat" id="agent-empty-message">
                I'm Agent Lee, your training assistant!
            </div>
            <!-- Messages will be added here dynamically -->
        </div>
        
        <!-- Message Input -->
        <textarea 
            class="agent-message-input" 
            id="agent-message-input" 
            rows="2" 
            placeholder="Ask me about our training courses..."></textarea>
        
        <!-- Control Buttons - First Row -->
        <div class="agent-control-row">
            <button class="agent-control-button agent-send-btn" id="agent-send-button">
                <span class="agent-icon">✉️</span> Send
            </button>
            <button class="agent-control-button agent-listen-btn" id="agent-listen-button">
                <span class="agent-icon">🎤</span> Listen
            </button>
            <button class="agent-control-button agent-stop-btn" id="agent-stop-button">
                <span class="agent-icon">⏹️</span> Stop
            </button>
            <button class="agent-control-button agent-help-btn" id="agent-help-button">
                <span class="agent-icon">❓</span> Help
            </button>
        </div>
    `;
    
    // Add Agent Lee CSS
    addAgentLeeStyles();
    
    // Add a trigger button for mobile/minimized view
    const triggerButton = document.createElement('div');
    triggerButton.id = 'agent-lee-trigger';
    triggerButton.className = 'agent-lee-trigger hidden';
    triggerButton.innerHTML = `
        <div class="agent-trigger-avatar">👩‍🏫</div>
        <div class="agent-trigger-tooltip">Need help? Click to chat with Agent Lee</div>
    `;
    
    // Append to document
    document.body.appendChild(agentCard);
    document.body.appendChild(triggerButton);
}

/**
 * Add the CSS styles for Agent Lee
 */
function addAgentLeeStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* Agent Lee Card Styles */
        .agent-lee-card {
            width: 320px;
            background-color: #1e293b;
            color: white;
            border-radius: 16px;
            border: 4px solid #0056b3;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px;
            z-index: 1000;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            user-select: none;
        }
        
        .agent-lee-card.minimized {
            width: 0;
            height: 0;
            opacity: 0;
            padding: 0;
            overflow: hidden;
        }
        
        /* Card Header */
        .agent-header {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: move;
            margin-bottom: 16px;
            position: relative;
        }
        
        .agent-avatar {
            width: 48px;
            height: 48px;
            background-color: #0056b3;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            border: 2px solid #93c5fd;
        }
        
        .agent-details h3 {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 4px;
        }
        
        .agent-details p {
            color: #bfdbfe;
            font-size: 14px;
        }
        
        .agent-toggle {
            position: absolute;
            right: 0;
            top: 0;
        }
        
        .agent-toggle button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-weight: bold;
            padding: 2px 8px;
        }
        
        /* Navigation Grid */
        .agent-navigation-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .agent-nav-button {
            background-color: #334155;
            border: none;
            color: white;
            padding: 8px 4px;
            text-align: center;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .agent-nav-button:hover {
            background-color: #0056b3;
        }
        
        .agent-nav-button span {
            font-size: 16px;
            margin-bottom: 4px;
            color: #60a5fa;
        }
        
        /* Chat Area */
        .agent-chat-area {
            height: 144px;
            background-color: #334155;
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 8px;
            overflow-y: auto;
            font-size: 14px;
        }
        
        .agent-message {
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 8px;
            max-width: 80%;
            word-wrap: break-word;
        }
        
        .agent-user-message {
            background-color: #475569;
            margin-left: auto;
            text-align: right;
        }
        
        .agent-assistant-message {
            background-color: #0056b3;
            margin-right: auto;
        }
        
        .agent-empty-chat {
            color: #94a3b8;
            text-align: center;
            font-style: italic;
            margin-top: 48px;
        }
        
        /* Message Input */
        .agent-message-input {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #475569;
            background-color: #475569;
            color: white;
            resize: none;
            margin-bottom: 12px;
            font-family: inherit;
        }
        
        .agent-message-input::placeholder {
            color: #94a3b8;
        }
        
        /* Control Buttons */
        .agent-control-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 8px;
        }
        
        .agent-control-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 4px;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 12px;
            cursor: pointer;
        }
        
        .agent-send-btn { background-color: #0056b3; }
        .agent-send-btn:hover { background-color: #003d82; }
        
        .agent-listen-btn { background-color: #16a34a; }
        .agent-listen-btn:hover { background-color: #22c55e; }
        
        .agent-stop-btn { background-color: #dc2626; }
        .agent-stop-btn:hover { background-color: #ef4444; }
        
        .agent-help-btn { background-color: #ca8a04; }
        .agent-help-btn:hover { background-color: #eab308; }
        
        /* Agent Lee Trigger Button (for minimized state) */
        .agent-lee-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
        }
        
        .agent-lee-trigger.hidden {
            display: none;
        }
        
        .agent-trigger-avatar {
            width: 60px;
            height: 60px;
            background-color: #0056b3;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        
        .agent-trigger-tooltip {
            background-color: white;
            color: #1e293b;
            padding: 8px 16px;
            border-radius: 20px;
            margin-right: 10px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .agent-lee-trigger:hover .agent-trigger-tooltip {
            opacity: 1;
            transform: translateX(0);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
            .agent-lee-card {
                width: 280px;
            }
            
            .agent-navigation-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
    
    document.head.appendChild(styleSheet);
}

/**
 * Make Agent Lee floatable anywhere on the screen
 */
function makeAgentLeeFloatable() {
    const agentCard = document.getElementById('agent-lee-card');
    
    // Make sure Agent Lee starts in a good position
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Position Agent Lee in the bottom right by default
    agentCard.style.position = 'fixed';
    agentCard.style.bottom = '20px';
    agentCard.style.right = '20px';
    agentCard.style.top = 'auto';
    agentCard.style.left = 'auto';
    
    // Add floating animation
    agentCard.style.animation = 'float 3s ease-in-out infinite';
    
    // Add floating animation keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0px);
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

/**
 * Set up all event listeners for Agent Lee
 */
function setupEventListeners() {
    // Get DOM elements
    const agentCard = document.getElementById('agent-lee-card');
    const dragHandle = document.getElementById('agent-drag-handle');
    const chatMessages = document.getElementById('agent-chat-messages');
    const emptyMessage = document.getElementById('agent-empty-message');
    const messageInput = document.getElementById('agent-message-input');
    const sendButton = document.getElementById('agent-send-button');
    const listenButton = document.getElementById('agent-listen-button');
    const stopButton = document.getElementById('agent-stop-button');
    const helpButton = document.getElementById('agent-help-button');
    const minimizeButton = document.getElementById('agent-minimize');
    const triggerButton = document.getElementById('agent-lee-trigger');
    const navButtons = document.querySelectorAll('.agent-nav-button');
    
    // Drag functionality - enhanced for full screen movement
    let isDragging = false;
    let offsetX, offsetY;
    
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = agentCard.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        agentCard.style.cursor = 'grabbing';
        // Stop floating animation while dragging
        agentCard.style.animation = 'none';
        
        // Set position to fixed for smooth dragging across the entire screen
        agentCard.style.position = 'fixed';
        
        // Calculate current position as fixed values
        const currentTop = rect.top;
        const currentLeft = rect.left;
        
        agentCard.style.bottom = 'auto';
        agentCard.style.right = 'auto';
        agentCard.style.top = `${currentTop}px`;
        agentCard.style.left = `${currentLeft}px`;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Keep card within viewport
        const cardWidth = agentCard.offsetWidth;
        const cardHeight = agentCard.offsetHeight;
        const maxX = window.innerWidth - cardWidth;
        const maxY = window.innerHeight - cardHeight;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Apply boundaries
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        agentCard.style.left = `${newX}px`;
        agentCard.style.top = `${newY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            agentCard.style.cursor = 'default';
            // Resume floating animation
            agentCard.style.animation = 'float 3s ease-in-out infinite';
        }
    });
    
    // Minimize/maximize functionality
    minimizeButton.addEventListener('click', () => {
        agentCard.classList.add('minimized');
        triggerButton.classList.remove('hidden');
        
        // Position trigger where the card was
        const cardRect = agentCard.getBoundingClientRect();
        triggerButton.style.position = 'fixed';
        triggerButton.style.top = `${Math.max(20, cardRect.top + 50)}px`;
        triggerButton.style.left = `${Math.max(20, cardRect.left + 130)}px`;
        triggerButton.style.bottom = 'auto';
        triggerButton.style.right = 'auto';
    });
    
    triggerButton.addEventListener('click', () => {
        agentCard.classList.remove('minimized');
        triggerButton.classList.add('hidden');
        
        // Position card where trigger was
        const triggerRect = triggerButton.getBoundingClientRect();
        agentCard.style.position = 'fixed';
        agentCard.style.top = `${Math.max(20, triggerRect.top - 50)}px`;
        agentCard.style.left = `${Math.max(20, triggerRect.left - 130)}px`;
        agentCard.style.bottom = 'auto';
        agentCard.style.right = 'auto';
        
        // Resume floating animation
        agentCard.style.animation = 'float 3s ease-in-out infinite';
    });
    
    // Send message functionality
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
    
    // Send message on Enter key (without Shift)
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Navigation button click handlers
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pagePath = button.getAttribute('data-page');
            const pageName = button.textContent.trim();
            
            // Add user message
            addMessage(`Take me to the ${pageName} page.`, 'user');
            
            // Add agent response
            const response = getPageNavigationResponse(pageName);
            addMessage(response, 'assistant');
            
            // Speak the response
            speakText(response);
            
            // Navigate to the page after a short delay
            setTimeout(() => {
                window.location.href = pagePath;
            }, 1500);
        });
    });
    
    // Listen button functionality
    listenButton.addEventListener('click', () => {
        startSpeechRecognition();
    });
    
    // Stop button functionality
    stopButton.addEventListener('click', () => {
        stopSpeaking();
    });
    
    // Help button functionality
    helpButton.addEventListener('click', () => {
        showHelpMessage();
    });
}

/**
 * Add a message to the chat area
 * @param {string} text - The message text
 * @param {string} sender - The sender ('user' or 'assistant')
 */
function addMessage(text, sender) {
    const chatMessages = document.getElementById('agent-chat-messages');
    const emptyMessage = document.getElementById('agent-empty-message');
    
    // Hide empty message if this is the first message
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('agent-message');
    messageElement.classList.add(sender === 'user' ? 'agent-user-message' : 'agent-assistant-message');
    messageElement.textContent = text;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Process and send a user message
 */
function sendMessage() {
    const messageInput = document.getElementById('agent-message-input');
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Process the message and get a response
    const response = processUserMessage(message);
    
    // Add agent response after a short delay
    setTimeout(() => {
        addMessage(response, 'assistant');
        speakText(response);
    }, 800);
}

/**
 * Process user message and return appropriate response
 * @param {string} message - The user message
 * @returns {string} - The agent response
 */
function processUserMessage(message) {
    message = message.toLowerCase();
    
    // Check for navigation requests
    if (message.includes('home') || message.includes('main page')) {
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        return "I'll take you to the Home page right away. This is where you can find an overview of all our training offerings.";
    } else if (message.includes('courses') || message.includes('training') || message.includes('class')) {
        setTimeout(() => { window.location.href = 'courses.html'; }, 1500);
        return "Taking you to our Course Catalog where you can browse all our professional trucking training courses.";
    } else if (message.includes('dashboard') || message.includes('my account') || message.includes('progress')) {
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        return "I'll bring up your Dashboard where you can track your progress and see your certifications.";
    } else if (message.includes('login') || message.includes('sign in')) {
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return "Directing you to the Login page. If you already have an account, you can sign in here.";
    } else if (message.includes('register') || message.includes('sign up') || message.includes('create account')) {
        setTimeout(() => { window.location.href = 'register.html'; }, 1500);
        return "Taking you to Registration. Create your account to start tracking your training progress.";
    } else if (message.includes('quiz') || message.includes('test') || message.includes('exam')) {
        setTimeout(() => { window.location.href = 'quiz.html'; }, 1500);
        return "I'll bring up our quiz page. This is where you can test your knowledge to earn your certification.";
    } else if (message.includes('faq') || message.includes('question') || message.includes('frequently asked')) {
        setTimeout(() => { window.location.href = 'faq.html'; }, 1500);
        return "Taking you to our Frequently Asked Questions page where you can find answers to common questions about our training platform.";
    }
    
    // Check if we can find a match in the FAQ database
    const faqAnswer = searchAgentLeeFAQ(message);
    if (faqAnswer) {
        return faqAnswer;
    }
    
    // FAQ responses fallback
    if (message.includes('cdl') || message.includes('license')) {
        return "No, you don't need a CDL to start our training. We offer courses for both beginners and experienced CDL holders.";
    } else if (message.includes('certificate') || message.includes('certification')) {
        return "Yes! After completing a course and passing the quiz, you'll receive a signed, printable certificate of completion.";
    } else if (message.includes('track') || message.includes('progress')) {
        return "Your progress is automatically tracked when you're logged in. Your dashboard shows completed courses, quiz scores, and certificates.";
    } else if (message.includes('trial') || message.includes('free')) {
        return "We provide sample lessons for each course that you can try before enrolling. Check the course details page to access these previews.";
    } else if (message.includes('mobile') || message.includes('phone') || message.includes('tablet')) {
        return "Yes! Our training platform is fully responsive and works great on mobile phones, tablets, and desktop computers.";
    } else if (message.includes('pace') || message.includes('own time') || message.includes('schedule')) {
        return "All our courses are self-paced. You can start, pause, and continue whenever it's convenient for you.";
    } else if (message.includes('expire')) {
        return "Once you enroll in a course, you have lifetime access to the content and your certificates.";
    } else if (message.includes('course') || message.includes('training')) {
        return "We offer 8 specialized courses covering CDL continuing education, dispatcher training, hours of service compliance, vehicle inspection, defensive driving, TMS training, customer service, and fleet safety.";
    } else if (message.includes('help') || message.includes('contact') || message.includes('support')) {
        return "For additional help, you can email us at training@alwaystrucking.com or call 1-800-TRUCKING. Our support team is available Monday-Friday, 8AM-6PM EST.";
    } else if (message.includes('faq') || message.includes('frequently asked questions') || message.includes('common questions')) {
        setTimeout(() => { window.location.href = 'faq.html'; }, 1500);
        return "I'm taking you to our FAQ page where you can find answers to commonly asked questions. You can also ask me directly anytime!";
    }
    
    // Default response
    return "I'm your Always Trucking training assistant. I can help you navigate our courses, answer questions about training, or direct you to specific pages. What would you like to know about?";
}

/**
 * Get a response for page navigation
 * @param {string} pageName - The name of the page
 * @returns {string} - The navigation response
 */
function getPageNavigationResponse(pageName) {
    const responses = {
        "Home": "Taking you to the Home page. You'll find an overview of all our training services there.",
        "Courses": "Navigating to our Course Catalog where you can browse all our professional trucking training courses.",
        "Dashboard": "Heading to your Dashboard. This is where you can track your progress and view your certifications.",
        "Login": "Going to the Login page. If you already have an account, you can sign in to access your training.",
        "Register": "Taking you to the Registration page. Create your account to start your professional training journey.",
        "Quiz": "Directing you to our Quiz page. Test your knowledge to earn your certification.",
        "FAQ": "Taking you to our Frequently Asked Questions page where you can find answers to common questions."
    };
    
    return responses[pageName] || `Taking you to the ${pageName} page.`;
}

/**
 * Add a page-specific greeting from Agent Lee
 */
function addPageSpecificGreeting() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Define page-specific greetings
    const greetings = {
        "index.html": "Welcome to Always Trucking and Loading LLC. I'm Agent Lee, your training guide. Whether you're preparing for a CDL license, learning dispatching, or brushing up on safety protocols, this site has everything you need. You can explore available courses, try a free sample, or log in to track your certifications. Let's get started!",
        "courses.html": "Here you'll find all of our professional-grade trucking courses. Whether you're exploring dispatching or deepening your CDL knowledge, you can browse each listing, preview content, and choose the path that suits your goals.",
        "course.html": "Welcome to this course breakdown. I'll walk you through what's covered, what skills you'll master, and how this training supports your long-term career goals. Don't forget to try the sample lesson before diving in.",
        "login.html": "Before we get rolling, please log in to track your progress. This helps us remember your certifications, lessons, and quizzes so you can pick up right where you left off — anytime, anywhere.",
        "register.html": "Creating an account is quick and easy. Once registered, you'll be able to track your progress, save your certifications, and access your training from anywhere.",
        "dashboard.html": "Welcome to your personal dashboard. Here you can track your course progress, view earned certificates, and continue where you left off in your training journey.",
        "quiz.html": "Let's test what you've learned! This quick quiz helps reinforce your knowledge. Don't worry — you can retake it and I'll be right here to support you.",
        "faq.html": "This is our Frequently Asked Questions page. I can help answer any questions you have about our courses, certificates, or platform. Feel free to browse the categories or ask me directly!"
    };
    
    // Get greeting for current page or use default
    const greeting = greetings[pageName] || "Welcome to Always Trucking and Loading LLC. I'm Agent Lee, your training assistant. How can I help you today?";
    
    // Add greeting as first message with a delay
    setTimeout(() => {
        const emptyMessage = document.getElementById('agent-empty-message');
        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }
        
        addMessage(greeting, 'assistant');
        speakText(greeting);
    }, 1000);
}

/**
 * Show a help message with Agent Lee capabilities
 */
function showHelpMessage() {
    const helpMessage = "I can help you with:\n" +
                         "- Navigating to different pages\n" +
                         "- Answering questions about courses\n" +
                         "- Explaining certification requirements\n" +
                         "- Finding specific training topics\n" +
                         "- Getting support information\n\n" +
                         "Just ask me anything or click the navigation buttons!";
    
    addMessage(helpMessage, 'assistant');
    speakText("I can help you with navigating to different pages, answering questions about courses, explaining certification requirements, finding specific training topics, and getting support information. Just ask me anything or click the navigation buttons!");
}

// ======= Speech Recognition and Synthesis =======

let speechSynthesis;
let speechUtterance;

/**
 * Initialize speech synthesis
 */
function initSpeechSynthesis() {
    speechSynthesis = window.speechSynthesis;
    speechUtterance = new SpeechSynthesisUtterance();
    
    // Set voice preferences - try to use a female US English voice if available
    speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            (voice.name.includes('Samantha') || voice.name.includes('Emma') || voice.name.includes('Female')) && 
            voice.lang.includes('en-US')
        ) || voices.find(voice => voice.lang.includes('en-US')) || voices[0];
        
        if (preferredVoice) {
            speechUtterance.voice = preferredVoice;
        }
    };
    
    // Set speech properties
    speechUtterance.rate = 1.0; // Speed
    speechUtterance.pitch = 1.0; // Pitch
    speechUtterance.volume = 1.0; // Volume
}

/**
 * Speak the provided text
 * @param {string} text - The text to speak
 */
function speakText(text) {
    // Stop any current speech
    stopSpeaking();
    
    // Set the new text and speak
    speechUtterance.text = text;
    speechSynthesis.speak(speechUtterance);
}

/**
 * Stop current speech
 */
function stopSpeaking() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

/**
 * Start speech recognition
 */
function startSpeechRecognition() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addMessage("Sorry, your browser doesn't support speech recognition. Try typing your question instead.", 'assistant');
        return;
    }
    
    // Create speech recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Set properties
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Add feedback message
    addMessage("Listening... Say something like 'Take me to courses' or 'What is Always Trucking?'", 'assistant');
    
    // Start listening
    recognition.start();
    
    // Event handlers
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('agent-message-input').value = speechResult;
        sendMessage();
    };
    
    recognition.onerror = (event) => {
        addMessage("Sorry, I didn't catch that. Please try again or type your question.", 'assistant');
    };
    
    recognition.onend = () => {
        // Recognition ended
    };
}