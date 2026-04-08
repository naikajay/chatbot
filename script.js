let userName = localStorage.getItem("name") || "";

// MEMORY
let memory = [];
let lastTopic = "";
let lastIntent = "";

const body = document.getElementById("chat-body");
const chat = document.getElementById("chatbox");

/* INIT */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("chat-btn").onclick = toggle;

  if (!userName) {
    userName = prompt("Enter your name:");
    localStorage.setItem("name", userName);
  }

  body.innerHTML = localStorage.getItem("chat") || "";

  if (!localStorage.getItem("welcome")) {
    add(`👋 Hey ${userName}! 😊  
I'm here to help with admissions, fees, and more.  
What are you looking for today?`, "bot");
    localStorage.setItem("welcome", true);
  }
});

/* TOGGLE */
function toggle() {
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

/* TIME */
function getTime() {
  let d = new Date();
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

/* ADD */
function add(msg, type) {
  let div = document.createElement("div");
  div.className = type;
  div.innerHTML = msg + `<div class="time">${getTime()}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  localStorage.setItem("chat", body.innerHTML);
}

/* CLEAR */
function clearChat() {
  body.innerHTML = "";
  localStorage.removeItem("chat");
}

/* NORMALIZE */
function normalize(text) {
  return text.toLowerCase();
}

/* HUMAN SMART REPLY */
function getReply(text) {
  text = normalize(text);

  if (/^(hi|hello|hey|yo|hii)/.test(text)) {
    return `Hey ${userName}! 😊  

Are you planning for admission in a course like CS?`;
  }

  if (text.includes("cs") || text.includes("computer")) {
    lastTopic = "cs";

    return `Nice 👍 CS is a great choice!

You’ll need 12th Science (PCM).  
Fees are around ₹70,000/year.

📞 You can contact: 02462-123456  

Want help with documents or fees details?`;
  }

  if (text.includes("fees")) {
    if (lastTopic === "cs" || memory.join(" ").includes("cs")) {
      return `For CS, fees are about ₹70,000/year  
+ small exam fee (~₹2,000)

If needed, I can also explain scholarships 👍`;
    }
    return `Fees depend on the course. Which one are you interested in?`;
  }

  if (text.includes("document")) {
    return `You’ll need:

• 10th & 12th marksheets  
• Aadhaar  
• Photo  
• Transfer certificate  

Submit at admin office 👍`;
  }

  if (text.includes("scholarship")) {
    return `Yes 👍 scholarships are available:

• Merit-based  
• Govt schemes  

Want me to check eligibility for you?`;
  }

  if (text.includes("last date")) {
    return `Admissions usually close around July–August.

Better confirm here:
📞 02462-123456`;
  }

  if (lastTopic === "cs") {
    return `Got it 👍 you're asking about CS.

What do you want next?

👉 fees  
👉 documents  
👉 scholarship`;
  }

  return `Hmm 🤔 I didn’t fully get that.

But I can help with:
• CS admission  
• fees  
• documents  

Just tell me 👍`;
}

/* SEND */
function send() {
  let input = document.getElementById("input");
  let text = input.value.trim();
  if (!text) return;

  memory.push(text);
  if (memory.length > 5) memory.shift();

  add(text, "user");
  input.value = "";

  let reply = getReply(text);

  setTimeout(() => {
    add(reply, "bot");
  }, 500);
}

/* ENTER */
document.getElementById("input").addEventListener("keypress", e => {
  if (e.key === "Enter") send();
});