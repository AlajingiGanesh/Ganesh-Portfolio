/* ================================================================= */
/* === CURTAIN AND UNLOCK ANIMATION LOGIC === */
/* ================================================================= */
/* ================================================================= */
/* === CURTAIN AND UNLOCK ANIMATION LOGIC === */
/* ================================================================= */
/* ================================================================= */
/* === CURTAIN AND UNLOCK ANIMATION LOGIC === */
/* ================================================================= */
function startUnlock() {
    const key = document.getElementById("key");
    const locker = document.getElementById("locker");
    const passkeyInput = document.getElementById("curtainPasskey");
    const errorMsg = document.getElementById("curtainErrorMsg");
    const unlockContainer = document.getElementById("unlock-container");

    const correctPasskey = "cherry"; // <--- CHANGE THIS TO YOUR DESIRED PASSWORD

    if (passkeyInput.value.toLowerCase() === correctPasskey) {
        errorMsg.style.display = "none";
        unlockContainer.classList.remove("fade-error");

        // Move key up to lock
        key.style.top = "-60px";
        key.style.transform = "rotate(720deg)";

        // Change lock emoji after key reaches it
        setTimeout(() => {
            locker.innerText = "🔓";
        }, 1000);

        // Open curtains, show content, scroll to top, then start flowers
        setTimeout(() => {
            document.getElementById("curtain-left").style.transform = "translateX(-100%)";
            document.getElementById("curtain-right").style.transform = "translateX(100%)";
            unlockContainer.style.display = "none";
            document.getElementById("chatbot-wrapper").style.display = "block";

            // Show main content and scroll to top immediately after curtain opens
            document.getElementById("main-content").style.display = "block";
            document.body.style.overflow = "auto";
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Start flower animation 2 seconds after unlock
            setTimeout(() => {
                createFlowers();
            }, 2000);

        }, 1600);

    } else {
        errorMsg.innerText = "❌ Incorrect passkey!";
        errorMsg.style.display = "block";
        unlockContainer.classList.add("fade-error");
        setTimeout(() => unlockContainer.classList.remove("fade-error"), 500);
    }
}
/* NEW: Handle 'Enter' key press on the password input field */
function handleCurtainKeydown(event) {
    if (event.key === 'Enter') {
        startUnlock();
    }
}

function createFlowers() {
    const flowerContainer = document.getElementById("flower-container");
    flowerContainer.style.display = "block";
    const flowerEmojis = ['🌸', '🌺', '🌼', '🌷', '🌹'];
    const numFlowers = 30;

    for (let i = 0; i < numFlowers; i++) {
        const flower = document.createElement("div");
        flower.classList.add("flower");
        flower.innerText = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

        // Randomize starting position and animation duration
        const startLeft = Math.random() * 100;
        const duration = 2; // Fixed duration of 2 seconds
        const delay = Math.random() * 0.5; // Shorter delay to make them appear faster

        flower.style.left = `${startLeft}vw`;
        flower.style.animationDuration = `${duration}s`;
        flower.style.animationDelay = `${delay}s`;

        flowerContainer.appendChild(flower);

        // Remove the flower after it falls to prevent memory leaks
        flower.addEventListener('animationend', () => {
            flower.remove();
        });
    }
    // Fade out the flower container after 2 seconds
    setTimeout(() => {
        flowerContainer.style.opacity = 0;
        setTimeout(() => {
            flowerContainer.style.display = 'none';
            flowerContainer.style.opacity = 1; // Reset opacity for next time
        }, 1000);
    }, 2000);
}



/* NEW: Password visibility toggle function */
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.nextElementSibling; // Get the next sibling, which is the eye icon

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerText = '🙈'; // Change to a closed eye emoji
    } else {
        passwordInput.type = 'password';
        toggleIcon.innerText = '👁️'; // Change back to an open eye
    }
}
/* ================================================================= */
/* === SMART RESUME CHATBOT LOGIC === */
/* ================================================================= */

let resumeText = "";

async function loadResume() {
    try {
        const pdf = await pdfjsLib.getDocument('resume.pdf').promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(s => s.str).join(" ") + " ";
        }
        resumeText = text;
        document.getElementById("question").disabled = false;
        document.getElementById("askBtn").disabled = false;
        appendMessage("Bot", "Hello ! Ask me anything about Alajingi Ganesh.");
        document.getElementById("question").focus();
    } catch (e) {
        appendMessage("Bot", "Error loading resume. Please ensure 'resume.pdf' is in the same directory.");
        console.error("Error loading PDF:", e);
    }
}

function openChatbot() {
    document.getElementById("chatbox").style.display = 'flex';
}

function closeChatbot() {
    document.getElementById("chatbox").style.display = 'none';
}

function speakText(text) {
    if ('speechSynthesis' in window && text.length < 300) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1;
        speechSynthesis.speak(utter);
    }
}

document.getElementById("toggleTheme").addEventListener("click", function () {
    document.body.classList.toggle('dark-mode');
});

document.getElementById("question").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        askQuestion();
    }
});

function askQuestion() {
    const q = document.getElementById("question").value.trim();
    if (!q) return;
    appendMessage("User", q);
    const a = smartAnswer(q);
    typeBotResponse(a);
    speakText(a);
    document.getElementById("question").value = "";
    document.getElementById("question").focus();
}

function smartAnswer(q) {
    q = q.toLowerCase();
    const simpleMap = {
        "name": "My full name is Alajingi Ganesh.",
        "who are you": "I am Alajingi Ganesh, a Computer Science student from IIIT Trichy.",
        "your graduation": "I will graduate in 2026.",
        "graduation year": "I am expected to graduate in 2026.",
        "cgpa": "My CGPA is 7.0.",
        "languages": "I can speak English, Telugu, Hindi , and Basics Tamil.",
        "how many languages": "I can speak three languages: English, Telugu, and Hindi.",
        "programming": "Python Programming and basics of C and C++.",
        "skills": "I am skilled in C++, Java, HTML, CSS, JavaScript, React, and MySQL.",
        "projects": "I have developed an E-commerce Website and an Expense Tracker.",
        "extra activity": "I am part of GDSC and serve as Carrom Club Coordinator.",
        "aim": "My aim is to become a skilled full stack developer and work at a top tech company.",
        "who created you": "I was created by Alajingi Ganesh himself.",
        "how can you help": "I can help by answering questions about Alajingi Ganesh’s resume and skills.",
        "where do you see yourself": "In the next 5 years, I see myself working in a reputed tech company, constantly learning and growing.",
        "what do you want": "I want to help users explore my resume and skills.",
        "thank you": "You are welcome!",
        "hi": "Hello! You can ask anything about Alajingi Ganesh.",
        "hello": "Hi, I am Alajingi Ganesh. Ask me anything.",
        "bye": "Have a good day ! See you again.",
        "strength": "I’m a self-driven person with a creative mindset. I love exploring new ideas and finding better ways to solve problems. I’m also good at teamwork and like taking up responsibilities.",
        "weakness": "Sometimes I overthink and try to make everything too perfect. I’ve realized that done is better than perfect, so I’m learning to balance it better.",
        "hobbies": "I enjoy exploring new tech trends, playing carrom, and participating in coding challenges. I also like organizing events, interacting with diverse people, and watching motivational videos to stay inspired and focused.",
        "interests": "I enjoy exploring new tech trends, playing carrom, and participating in coding challenges. I also like organizing events, interacting with diverse people, and watching motivational videos to stay inspired and focused.",
        "salary": "Based on my skills, projects, and the industry standards, I believe a starting package of ₹7 LPA is fair and motivating. I’m confident that I can deliver value to match and exceed that expectation.",
        "why should we hire you": "Because I bring a strong mix of technical skills, creativity, and genuine passion for learning. I don’t just code — I build. I’m also someone who takes ownership, adapts fast, and collaborates well. I won’t just fill a role — I’ll grow with it.",
        "after 5 years": "I see myself as a reliable and skilled professional leading impactful tech projects, contributing to product innovation, and possibly mentoring junior developers. My goal is to become a key contributor wherever I work — technically and culturally.",
        "different from other candidates": "I combine technical foundation with creativity and persistence. I’m not afraid to try new things, take smart risks, and I keep improving. I’ve built real projects, taken part in clubs, and balanced responsibilities — all of which shaped my mindset to be solution-oriented and dependable.",
        "challenge": "During my e-commerce project, I had to implement a full cart system without backend support. It was tricky, but I used client-side JS with local storage smartly and made it user-friendly. This taught me how to handle limitations creatively.",
        "relocation": "Yes. I believe flexibility is a strength in today's dynamic work culture. I'm always open to new places and experiences that help me grow professionally.",
        "team player": "Both. I enjoy working in teams where ideas bounce and grow — like in GDSC and Carrom Club. But I’m equally comfortable taking full ownership of tasks, as I did in my solo portfolio and project builds. I adjust based on what brings the best outcome.",
        "failure": "I treat it as feedback, not defeat. In fact, failure has taught me more than success. I analyze, learn, and come back stronger. That mindset helps me grow continuously and improve with every attempt.",
        "criticism": "I treat it as feedback, not defeat. In fact, failure has taught me more than success. I analyze, learn, and come back stronger. That mindset helps me grow continuously and improve with every attempt.",
        "work environment": "A place where innovation is valued, learning is constant, and people support each other’s growth. I thrive in environments that are collaborative, open to ideas, and driven by meaningful goals."
    };
    for (let key in simpleMap) {
        if (q.includes(key)) return simpleMap[key];
    }
    // Math handling
    try {
        if (/^[0-9+\-*/().\s]+$/.test(q)) {
            return "The answer is " + eval(q);
        }
    } catch (e) {}
    return "Sorry, I could not find a relevant answer.";
}

function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender === "User" ? "user-msg" : "bot-msg"}`;
    msg.innerText = text;
    document.getElementById("chat").appendChild(msg);
    document.getElementById("chat").scrollTop = 9999;
}

function typeBotResponse(text) {
    const chat = document.getElementById("chat");
    const msg = document.createElement("div");
    msg.className = "message bot-msg";
    chat.appendChild(msg);
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            msg.innerText += text.charAt(index);
            chat.scrollTop = chat.scrollHeight;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

// Initial load
loadResume();


/* ================================================================= */
/* === RESUME PASSKEY LOGIC === */
/* ================================================================= */

function promptDownload() {
    document.getElementById("resumePrompt").style.display = "flex";
    document.getElementById("resumeKey").value = "";
    document.getElementById("errorMsg").innerText = "";
    document.getElementById("successTick").style.display = "none";
}

function closePrompt() {
    document.getElementById("resumePrompt").style.display = "none";
    document.getElementById("popupBox").classList.remove("shake");
}

function verifyKey() {
    const key = document.getElementById("resumeKey").value.trim();
    const correctKey = "cherry#2003";
    const errorMsg = document.getElementById("errorMsg");
    const popup = document.getElementById("popupBox");

    if (key === correctKey) {
        document.getElementById("successTick").style.display = "block";
        errorMsg.innerText = "";

        setTimeout(() => {
            const link = document.createElement("a");
            link.href = "resume.pdf";
            link.download = "Alajingi_Ganesh_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            closePrompt();
        }, 1000);
    } else {
        popup.classList.add("shake");
        errorMsg.innerText = "❌ Incorrect passkey!";
        setTimeout(() => popup.classList.remove("shake"), 500);
    }
}


/* ================================================================= */
/* === SKILL SECTION MODAL & ANIMATION LOGIC === */
/* ================================================================= */

// Animate bars
document.addEventListener("DOMContentLoaded", () => {
    const skills = document.querySelectorAll(".skill");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector(".fill");
                const percent = entry.target.getAttribute("data-percent");
                fill.style.width = percent + "%";
            }
        });
    }, { threshold: 0.4 });

    skills.forEach(skill => observer.observe(skill));
});

// Modal logic
function openModal(title, description) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-description").innerText = description;
    document.getElementById("skillModal").style.display = "block";
}

function closeModal() {
    document.getElementById("skillModal").style.display = "none";
}


/* ================================================================= */
/* === PROJECT NOTEBOOK LOGIC === */
/* ================================================================= */

let currentPages = { pages1: 0, pages2: 0 };

function openNotebook(id) {
    document.getElementById(id).style.display = 'block';
}

function closeNotebook(id) {
    document.getElementById(id).style.display = 'none';
    const pageContainerId = id === 'notebook1' ? 'pages1' : 'pages2';
    currentPages[pageContainerId] = 0;
    document.getElementById(pageContainerId).style.transform = 'translateX(0)';
}

function changePage(containerId, step) {
    const container = document.getElementById(containerId);
    const pages = container.querySelectorAll('.notebook-page');
    currentPages[containerId] += step;
    if (currentPages[containerId] < 0) currentPages[containerId] = 0;
    if (currentPages[containerId] >= pages.length) currentPages[containerId] = pages.length - 1;
    container.style.transform = `translateX(-${currentPages[containerId] * 100}%)`;
}


/* ================================================================= */
/* === EDUCATION POPUP LOGIC === */
/* ================================================================= */

function openEduPopup(type) {
    let content = '';
    if (type === 'school') {
        content = `
            <h3>🧮 School (SSC) – XYZ High School</h3>
            <div class="edu-gallery">
                <img src="school/all students.jpg" onclick="openImagePopup(this.src)" />
                <img src="school/scouts and guides.jpg" onclick="openImagePopup(this.src)" />
                <img src="school/me yoga.webp" onclick="openImagePopup(this.src)" />
                <img src="school/me teachersday.jpg" onclick="openImagePopup(this.src)" />
                <img src="school/me with pt sir.jpg" onclick="openImagePopup(this.src)" />
            </div>
            <p><strong>Address:</strong> Diamond hills , Gachibowli , Hyderabad 500032</p>
            <p><strong>Achievements:</strong> Class topper, Science fair winner, School Pupil Leader</p>
        `;
    } else if (type === 'inter') {
        content = `
            <h3>📐 Intermediate (MPC) – Sri Chaitanya Junior Kalasala 500032</h3>
            <div class="edu-gallery">
                <img src="inter/college.jpg" onclick="openImagePopup(this.src)" />
                <img src="inter/me and frds bike.jpg" onclick="openImagePopup(this.src)" />
                <img src="inter/me in class.jpg" onclick="openImagePopup(this.src)" />
                <img src="inter/me with frds.jpg" onclick="openImagePopup(this.src)" />
                <img src="inter/me with snake.jpg" onclick="openImagePopup(this.src)" />
            </div>
            <p><strong>Address:</strong> Manikonda, Hyderabad</p>
            <p><strong>Achievements:</strong> One of the Topper in class</p>
        `;
    } else if (type === 'btech') {
        content = `
            <h3>💻 B.Tech – IIIT Trichy</h3>
            <div class="edu-gallery">
                <img src="college/iiitt.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/college.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/cricket winners.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/carroms cup.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/bday harshith.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/frds.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/cls frds.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/mess anna.jpg" onclick="openImagePopup(this.src)" />
                <img src="college/cherry.jpg" onclick="openImagePopup(this.src)" />
            </div>
            <p><strong>Address:</strong> Sethura patti , Tiruchirappalli, Tamil Nadu 620012</p>
            <p><strong>Achievements:</strong> GDSC Member, Carrom Club Coordinator </p>
        `;
    }
    document.getElementById("eduPopupContent").innerHTML += content;
    document.getElementById("eduPopup").style.display = 'flex';
}

function closeEduPopup() {
    document.getElementById("eduPopup").style.display = 'none';
    document.getElementById("eduPopupContent").innerHTML = `<button class="popup-close" onclick="closeEduPopup()">×</button>`;
}

function openImagePopup(src) {
    const img = document.getElementById("popupImage");
    img.src = src;
    document.getElementById("imagePopup").style.display = "flex";
}

function closeImagePopup(event) {
    if (!event || event.target.id === "imagePopup" || event.target.id === "closePopupBtn") {
        document.getElementById("imagePopup").style.display = "none";
        document.getElementById("popupImage").src = "";
    }
}


/* ================================================================= */
/* === CONTACT SECTION LOGIC === */
/* ================================================================= */

function triggerContact(emoji, link) {
    const pop = document.createElement("div");
    pop.className = "popup-emoji";
    pop.innerText = emoji;
    pop.style.left = `${Math.random() * 80 + 10}%`;
    pop.style.top = `60%`;
    document.body.appendChild(pop);
    setTimeout(() => document.body.removeChild(pop), 1500);
    setTimeout(() => {
        window.open(link, "_blank");
    }, 700);
}

function handleSubmit(e) {
    e.preventDefault();
    document.getElementById("popupOverlay").style.display = "block";
    document.getElementById("contactForm").reset();
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}


/* ================================================================= */
/* === BACK TO TOP & FOOTER LOGIC === */
/* ================================================================= */

// Show the scroll button after scrolling down 200px
window.addEventListener("scroll", function () {
    const btn = document.getElementById("scrollTopBtn");
    if (window.scrollY > 200) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
});

// Scroll smoothly to the top when clicked
document.getElementById("scrollTopBtn").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}