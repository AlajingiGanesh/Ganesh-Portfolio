/* ================================================================= */
/* === CURTAIN AND UNLOCK ANIMATION LOGIC === */
/* ================================================================= */
/*
This section handles the curtain, lock, and key animations that play when the page loads.
It also includes the logic for the falling flower animation.
*/
function startUnlock() {
    const key = document.getElementById("key");
    const locker = document.getElementById("locker");
    const unlockContainer = document.getElementById("unlock-container");

    // Stop floating/bounce animations
    key.style.animation = "none";
    locker.style.animation = "none";

    // Move lock & key to center (simulate overlap)
    locker.style.transform = "translateY(40px)";
    key.style.transform = "translateY(-65px) translateX(10px)";

    // After reaching center, rotate key
    setTimeout(() => {
        key.style.transition = "transform 0.8s ease";
        key.style.transform = "translateY(-65px) translateX(10px) rotate(360deg)";
    }, 1000);

    // Change lock emoji to unlocked
    setTimeout(() => {
        locker.innerText = "🔓";
    }, 1800);

    // Curtains open + page visible
    setTimeout(() => {
        document.getElementById("curtain-left").style.transform = "translateX(-100%)";
        document.getElementById("curtain-right").style.transform = "translateX(100%)";
        unlockContainer.style.display = "none";
        document.getElementById("chatbot-wrapper").style.display = "block";
        document.getElementById("main-content").style.display = "block";
        document.body.style.overflow = "auto";
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
            createFlowers();
        }, 2000);
    }, 2200);
}



// Handle 'Enter' key press on the password input field
function handleCurtainKeydown(event) {
    if (event.key === 'Enter') {
        startUnlock();
    }
}

// Function to create and animate falling flowers
function createFlowers() {
    const flowerContainer = document.getElementById("flower-container");
    flowerContainer.style.display = "block";
    const starEmojis = ['⭐', '🌟', '✨', '💫', '🌠'];
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
/*
This section contains the logic for the smart resume chatbot.
It loads a PDF, processes the text, and provides answers to user questions
based on a predefined set of questions and answers.
*/

// ===== Resume-driven Q&A + Smart Options =====
// Facts pulled from your uploaded resume and prior mappings
const resumeData = {
  objective:
    "Dynamic and committed student pursuing Computer Science and Engineering at IIIT Trichy, eager to apply expertise in real-world projects. Passionate about contributing to innovative initiatives and tackling industry challenges.",
  education:
    "B.Tech in Computer Science and Engineering at IIIT Trichy (Nov 2022 – May 2026). Current CGPA: 7.0.",
  experience:
    "E-Commerce Website (Internship/Hands-on): Built a responsive client-side platform for product exploration, quick search, and smooth shopping experience using HTML, CSS, JavaScript, and Bootstrap.",
  projects: [
    {
      name: "Personal Expense Tracker",
      stack: "PHP, MySQL, JavaScript, HTML/CSS",
      points: [
        "Secure logging of income/expenses with balance calculation",
        "Interactive animated graphs for real-time visualization",
        "Responsive UI for smooth experience",
      ],
    },
    {
      name: "Hospital Management System",
      stack: "PHP, MySQL, JavaScript, HTML/CSS",
      points: [
        "Centralized platform for patients, staff, and appointments",
        "Relational database schema design for operations",
        "Intuitive interface to simplify scheduling",
      ],
    },
    {
      name: "Job Portal (Rhize OS Task)",
      stack: "MERN (MongoDB, Express, React, Node), JWT",
      points: [
        "Listings & applications with role-based access (recruiter/applicant)",
        "JWT authentication & secure flows",
        "AI-guided features, responsive React frontend",
      ],
    },
  ],
  certifications:
    "Scouts & Guides Certificate; Google Developer Student Club Certificates; Web Development Internship Certification; CodSoft Offer Letter; Participation in ICAT Exam.",
  achievements:
    "Won Cricket Cup (2024), Won Carrom Cup (2025), Multiple Kabaddi Cups in school.",
  activities:
    "GDSC participant (Jul 2024), Carrom Club Coordinator (Jul 2025), Dance Club Coordinator, School Pupil Leader (2 years).",
  skillsCore: "C++, Java, HTML, CSS, JavaScript, React, MySQL",
  skillsPlus:
    "PHP, Bootstrap, Node.js, Express.js, MongoDB (MERN), JWT Auth, basic Python (Data Analytics with Python), Git/GitHub, Responsive UI, Problem Solving",
  languagesSpoken:
    "English, Telugu, Hindi, and basic Tamil.",
  aim:
    "To become a skilled full-stack developer and work at a top tech company.",
  contact: {
    location: "Hyderabad",
    email: "ganeshalajingi123@gmail.com",
    linkedin: "linkedin.com/in/alajingiganesh",
    github: "github.com/AlajingiGanesh",
  },
  keyTraits:
    "Adaptive Learning, Team Work, Time Management, Positive Attitude, Presentation Skills, Relationship Building, Self-Motivated, Leadership Qualities",
  strengths:
    "Self-driven, creative mindset, collaborative, takes ownership, learns fast.",
  weaknesses:
    "Tendency to overthink and aim for perfection—actively balancing done vs. perfect.",
  challengeStory:
    "In an e-commerce build, implementing a full cart without a backend was tricky. I used client-side JS with localStorage, designed clean state updates, and delivered a user-friendly flow—turning constraints into a learning opportunity.",
  workStyle:
    "Thrive in collaborative, learning-oriented teams that value innovation and ownership.",
  relocation: "Open to relocation and new environments that support growth.",
  expectedSalary:
    "Based on skills and market, a starting package around ₹7 LPA is reasonable; I’m confident of delivering value to exceed expectations.",
  availability: "Available for internships and full-time roles aligned with web/app development and full-stack engineering.",
};

// (Keeps your existing variables)
let resumeText = "";

// ===== Startup: greet + enable inputs + show options =====
async function loadResume() {
  // Keep your pdf.js flow intact (non-blocking for Q&A)
  try {
    const pdf = await pdfjsLib.getDocument("resume.pdf").promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((s) => s.str).join(" ") + " ";
    }
    resumeText = text;
  } catch (e) {
    // Silent catch—Q&A still works from resumeData
    console.warn("PDF load issue (resume.pdf). Falling back to structured data.", e);
  }

  document.getElementById("question").disabled = false;
  document.getElementById("askBtn").disabled = false;

  appendMessage("Bot", "👋 Hello! Welcome to my Resume Chatbot. Ask anything about me, or pick a quick question below.");
  showDefaultOptions(); // show clickable interview-style prompts
  document.getElementById("question").focus();
}

// ===== Quick question chips =====
function showDefaultOptions() {
  const chat = document.getElementById("chat");

  const options = [
    // High-signal interview quick prompts
    "Tell about you",
    "What are your key strengths?",
    "What is your weakness?",
    "Education",
    "Experience",
    "Projects",
    "Explain your Job Portal project",
    "Explain your Expense Tracker project",
    "Explain your Hospital Management System project",
    "Skills",
    "Tech stack you know",
    "Programming languages you know",
    "Certifications",
    "Achievements",
    "Activities / Leadership",
    "Languages you speak",
    "Your Goal / Aim",
    "What challenges have you faced?",
    "Preferred work environment",
    "Are you open to relocation?",
    "Expected salary",
    "How can I contact you?",
    "Share your GitHub / LinkedIn",
    // Extras often asked in interviews/HR
    "Why should we hire you?",
    "What makes you different from other candidates?",
    "Where do you see yourself in 5 years?",
    "Hobbies / Interests",
    "Availability",
  ];

  const container = document.createElement("div");
  container.className = "bot-options";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => {
      appendMessage("User", opt);
      const a = smartAnswer(opt);
      typeBotResponse(a);
      speakText(a);
    };
    container.appendChild(btn);
  });
  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

// ===== Core smart answer (expanded) =====
function smartAnswer(q) {
  const question = q.toLowerCase();

  // Category shortcuts
  if (includesAny(question, ["tell about", "about you", "who are you", "objective"]))
    return resumeData.objective;

  if (includesAny(question, ["education", "study", "college", "cgpa", "graduation"]))
    return `${resumeData.education} Graduation year: 2026.`;

  if (includesAny(question, ["experience", "internship", "work experience"]))
    return resumeData.experience;

  if (includesAny(question, ["skills", "skillset"]))
    return `Core: ${resumeData.skillsCore}\nAlso worked with: ${resumeData.skillsPlus}`;

  if (includesAny(question, ["tech stack"]))
    return `${resumeData.skillsCore}; plus ${resumeData.skillsPlus}.`;

  if (includesAny(question, ["programming languages"]))
    return "C++, Java, JavaScript (React), plus PHP and basic Python.";

  if (includesAny(question, ["projects"]))
    return formatProjects(resumeData.projects);

  // Project deep-dives
  if (includesAny(question, ["expense", "tracker"]))
    return detailProject("Personal Expense Tracker");
  if (includesAny(question, ["hospital", "management"]))
    return detailProject("Hospital Management System");
  if (includesAny(question, ["job portal", "job-portal", "mern"]))
    return detailProject("Job Portal (Rhize OS Task)");

  if (includesAny(question, ["achievements", "awards", "prizes"]))
    return resumeData.achievements;

  if (includesAny(question, ["activities", "leadership", "clubs", "positions"]))
    return resumeData.activities;

  if (includesAny(question, ["certificate", "certifications"]))
    return resumeData.certifications;

  if (includesAny(question, ["languages you speak", "speak", "communication"]))
    return resumeData.languagesSpoken;

  if (includesAny(question, ["goal", "aim"]))
    return resumeData.aim;

  if (includesAny(question, ["challenge", "difficult", "problem faced"]))
    return resumeData.challengeStory;

  if (includesAny(question, ["work environment", "culture", "team", "collaboration"]))
    return resumeData.workStyle;

  if (includesAny(question, ["relocation"]))
    return resumeData.relocation;

  if (includesAny(question, ["expected salary", "ctc", "salary"]))
    return resumeData.expectedSalary;

  if (includesAny(question, ["availability", "join", "notice"]))
    return resumeData.availability;

  if (includesAny(question, ["contact", "email", "phone", "reach"]))
    return `Location: ${resumeData.contact.location}\nEmail: ${resumeData.contact.email}`;

  if (includesAny(question, ["github", "linkedin", "links"]))
    return `GitHub: ${resumeData.contact.github}\nLinkedIn: ${resumeData.contact.linkedin}`;

  if (includesAny(question, ["strength", "strengths"]))
    return resumeData.strengths;

  if (includesAny(question, ["weakness", "weaknesses"]))
    return resumeData.weaknesses;

  if (includesAny(question, ["why should we hire you", "hire you"]))
    return "I combine solid fundamentals with hands-on projects and a creative, ownership-driven mindset. I adapt quickly, collaborate well, and focus on delivering business value—so I won’t just fill a role, I’ll grow it.";

  if (includesAny(question, ["different from other candidates", "unique", "stand out"]))
    return "I’m a builder with persistence—comfortable taking end-to-end ownership, learning fast, and shipping usable outcomes. My mix of leadership activities and practical projects gives me both soft skills and technical depth.";

  if (includesAny(question, ["5 years", "five years", "where do you see yourself"]))
    return "Leading impactful projects as a reliable full-stack engineer, mentoring juniors, and contributing to product decisions while continuously learning.";

  if (includesAny(question, ["hobby", "hobbies", "interests"]))
    return "Exploring new tech trends, playing carrom, coding challenges, organizing events, and watching motivational content to stay focused.";

  // Math handling (same as your original, guarded)
  try {
    if (/^[0-9+\-*/().\s]+$/.test(question)) {
      // eslint-disable-next-line no-eval
      return "The answer is " + eval(question);
    }
  } catch (e) {}

  return "Sorry, I couldn’t find a precise answer. Try one of the quick questions above or ask about Education, Experience, Projects, Skills, or Achievements.";
}

// ===== Helpers =====
function includesAny(text, keys) {
  return keys.some((k) => text.includes(k));
}

function formatProjects(list) {
  return list
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} — ${p.stack}\n   • ${p.points.join("\n   • ")}`
    )
    .join("\n\n");
}

function detailProject(name) {
  const p = resumeData.projects.find((x) => x.name.toLowerCase().includes(name.toLowerCase()));
  if (!p) return "Project details not found.";
  return `${p.name} — ${p.stack}\n• ${p.points.join("\n• ")}`;
}

// ===== Your existing functions remain unchanged below =====

// Open/close
function openChatbot() {
  document.getElementById("chatbox").style.display = "flex";
}
function closeChatbot() {
  document.getElementById("chatbox").style.display = "none";
}

// TTS
function speakText(text) {
  if ("speechSynthesis" in window && text.length < 300) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    speechSynthesis.speak(utter);
  }
}

// Theme toggle
document.getElementById("toggleTheme").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// Enter to ask
document.getElementById("question").addEventListener("keydown", function (e) {
  if (e.key === "Enter") askQuestion();
});

// Ask flow
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

// Append message
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender === "User" ? "user-msg" : "bot-msg"}`;
  msg.innerText = text;
  document.getElementById("chat").appendChild(msg);
  document.getElementById("chat").scrollTop = 9999;
}

// Typing effect
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

            // After typing is done → speak
            speakText(text);

            // After voice finished (approx timing = text length / speed), show "More Questions" button
            setTimeout(() => {
                showMoreQuestionsButton();
            }, Math.min(3000, text.length * 20));
        }
    }, 15);
}

function showMoreQuestionsButton() {
    const chat = document.getElementById("chat");
    const container = document.createElement("div");
    container.className = "bot-options";

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = "➕ More Questions";
    btn.onclick = () => {
        container.remove(); // remove button
        showDefaultOptions(); // show options again
    };

    container.appendChild(btn);
    chat.appendChild(container);
    chat.scrollTop = chat.scrollHeight;
}

// Boot
loadResume();



/* ================================================================= */
/* === RESUME PASSKEY LOGIC === */
/* ================================================================= */
/*
This section handles the passkey prompt for downloading the resume.
It validates the user-entered passkey and triggers the download on success.
*/

// Function to show the resume download prompt
function promptDownload() {
    document.getElementById("resumePrompt").style.display = "flex";
    document.getElementById("resumeKey").value = "";
    document.getElementById("errorMsg").innerText = "";
    document.getElementById("successTick").style.display = "none";
}

// Function to close the resume download prompt
function closePrompt() {
    document.getElementById("resumePrompt").style.display = "none";
    document.getElementById("popupBox").classList.remove("shake");
}

// Function to verify the entered passkey
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
/*
This section manages the popups for the skills section, including a small tooltip-like modal
and a larger popup for all skills.
*/


// Function to open the small skill modal
function openModal(title, description, event) {
    const modal = document.getElementById("skillModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    // Position near clicked skill
    const rect = event.target.getBoundingClientRect();
    modal.style.top = (window.scrollY + rect.top + rect.height + 10) + "px";
    modal.style.left = (window.scrollX + rect.left) + "px";

    modal.style.display = "block";
}

// Function to close the small skill modal
function closeModal() {
    document.getElementById("skillModal").style.display = "none";
}

// Function to open the large skills popup
function openSkillPopup() {
    document.getElementById("skills-popup").style.display = "flex";
}

// Function to close the large skills popup
function closeSkillPopup() {
    document.getElementById("skills-popup").style.display = "none";
}



/* ================================================================= */
/* === PROJECT NOTEBOOK LOGIC === */
/* ================================================================= */
/*
This section controls the interactive notebook popups for the projects.
It handles opening, closing, and navigating through the pages of each notebook.
*/

let currentPages = { pages1: 0, pages2: 0 };

// Function to open a specific notebook
function openNotebook(id) {
    document.getElementById(id).style.display = 'block';
}

// Function to close a notebook and reset its page
function closeNotebook(id) {
    document.getElementById(id).style.display = 'none';
    const pageContainerId = id === 'notebook1' ? 'pages1' : 'pages2';
    currentPages[pageContainerId] = 0;
    document.getElementById(pageContainerId).style.transform = 'translateX(0)';
}

// Function to change the page in a notebook
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
/*
This section manages the popups for the education section, displaying details
and a photo gallery for each educational institution.
*/

// Function to open the education popup with dynamic content
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

// Function to close the education popup
function closeEduPopup() {
    document.getElementById("eduPopup").style.display = 'none';
    document.getElementById("eduPopupContent").innerHTML = `<button class="popup-close" onclick="closeEduPopup()">×</button>`;
}

// Function to open the enlarged image popup
function openImagePopup(src) {
    const img = document.getElementById("popupImage");
    img.src = src;
    document.getElementById("imagePopup").style.display = "flex";
}

// Function to close the enlarged image popup
function closeImagePopup(event) {
    if (!event || event.target.id === "imagePopup" || event.target.id === "closePopupBtn") {
        document.getElementById("imagePopup").style.display = "none";
        document.getElementById("popupImage").src = "";
    }
}


/* ================================================================= */
/* === Certificate SECTION LOGIC === */
/* ================================================================= */
/*
This section handles the logic for viewing PDF certificates in a popup.
*/



    // Function to open a certificate image in a popup
    function openCertificate(fileSrc) {
        document.getElementById("certificate-file").src = fileSrc;
        document.getElementById("certificate-popup").style.display = "flex";
    }

    // Function to close the certificate popup
    function closeCertificatePopup() {
        document.getElementById("certificate-popup").style.display = "none";
        document.getElementById("certificate-file").src = ""; // clear on close
    }


/* ================================================================= */
/* === CONTACT SECTION LOGIC === */
/* ================================================================= */
/*
This section contains logic for the contact form, including a visual effect
when contact links are clicked and a "thank you" popup after form submission.
*/

// Function to trigger a visual popup emoji and open a link
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

// Function to handle the contact form submission
function handleSubmit(e) {
    e.preventDefault();
    document.getElementById("popupOverlay").style.display = "block";
    document.getElementById("contactForm").reset();
}

// Function to close the contact form "thank you" popup
function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}


/* ================================================================= */
/* === BACK TO TOP & FOOTER LOGIC === */
/* ================================================================= */
/*
This section manages the "back to top" button functionality and general footer logic.
*/

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

// Function to scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}