let userName = localStorage.getItem("name") || "";

// MEMORY
let memory = [];
let lastTopic = "";

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
    add(`👋 Hey ${userName}! Ask me anything 😊`, "bot");
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

/* 🧠 LOCAL SMART LOGIC */
function getLocalReply(text) {
  text = normalize(text);

  // RESET CONTEXT
  if (text.includes("library") || text.includes("wifi")) {
    lastTopic = "";
  }

  // GREETING
  if (/^(hi|hello|hey|yo)/.test(text)) {
    return `Hey ${userName}! 😊 What can I help you with?`;
  }

  // LIBRARY
  if (text.includes("library")) {
    lastTopic = "library";
    return `📚 Library Card:

1. Visit library desk  
2. Fill form  
3. Submit ID  
4. Get card same day  

📞 02462-222333`;
  }

  // WIFI
  if (text.includes("wifi")) {
    lastTopic = "wifi";
    return `📶 WiFi:

Username = student ID  
Password from admin  

📞 IT: 02462-999888`;
  }

  // CS
  if (text.includes("cs")) {
    lastTopic = "cs";
    return `CS Admission 👍

Fees: ₹70,000/year  
📞 02462-123456`;
  }

  // FEES
  if (text.includes("fees")) {
    if (lastTopic === "cs" || memory.join(" ").includes("cs")) {
      return `CS Fees: ₹70,000/year 👍`;
    }
  }

  return null; // VERY IMPORTANT
}

/* 🤖 API CALL (SEARCH ANYTHING) */
async function getAIResponse(message) {
  try {
    let res = await fetch("https://your-render-url.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    let data = await res.json();
    return data.reply;

  } catch {
    return "⚠️ Unable to fetch answer right now.";
  }
}

/* SEND */
async function send() {
  let input = document.getElementById("input");
  let text = input.value.trim();
  if (!text) return;

  memory.push(text);
  if (memory.length > 5) memory.shift();

  add(text, "user");
  input.value = "";

  // 1️⃣ LOCAL FIRST
  let localReply = getLocalReply(text);

  if (localReply) {
    setTimeout(() => add(localReply, "bot"), 400);
    return;
  }

  // 2️⃣ API FALLBACK
  let loading = document.createElement("div");
  loading.className = "bot";
  loading.innerText = "🤖 Searching...";
  body.appendChild(loading);

  let aiReply = await getAIResponse(text);

  body.removeChild(loading);
  add(aiReply, "bot");
}

/* ENTER */
document.getElementById("input").addEventListener("keypress", e => {
  if (e.key === "Enter") send();
});
