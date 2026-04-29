/*
  File: js/main.js
  Purpose: Shared behavior for all pages (mobile nav, active link state, and footer year).
*/

(function initPortalShell() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-current-year]");

  if (toggle && nav) {
    toggle.addEventListener("click", function onToggleNav() {
      const isOpen = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");
  links.forEach(function setActive(link) {
    const href = link.getAttribute("href") || "";
    const normalized = href.split("/").pop();
    if (normalized === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  initMotionSystem();
  initSharedChatbot();
})();

/*
  Creates staggered entrance animation for key page blocks.
  Respects reduced-motion preferences for accessibility.
*/
function initMotionSystem() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const targets = document.querySelectorAll("main .hero, main .section-title, main .card, main .alert");

  targets.forEach(function prep(target, index) {
    target.classList.add("reveal-item");
    const delay = Math.min((index % 8) * 70, 420);
    target.style.setProperty("--reveal-delay", delay + "ms");
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function forceVisible(target) {
      target.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function onIntersect(entries) {
      entries.forEach(function eachEntry(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach(function observe(target) {
    observer.observe(target);
  });
}

/*
  Adds a shared local chatbot to each page. If a page already has chatbot markup,
  it reuses that existing UI instead of creating a duplicate.
*/
function initSharedChatbot() {
  const BEDROCK_PROXY_ENDPOINT = "https://mfobabs5n0.execute-api.us-east-2.amazonaws.com/dev/ask";
  const DEFAULT_MAX_TOKENS = 200;
  const DEFAULT_TEMPERATURE = 0.3;
  const MAX_CONTEXT_MESSAGES = 8;
  const apiKeyFromWindow = typeof window.PORTAL_BEDROCK_API_KEY === "string" ? window.PORTAL_BEDROCK_API_KEY : "";
  const apiKeyFromStorage = localStorage.getItem("portalBedrockApiKey") || "";
  const apiKey = (apiKeyFromWindow || apiKeyFromStorage).trim();

  let thread = document.getElementById("chatbot-thread");
  let input = document.getElementById("chatbot-input");
  let sendButton = document.getElementById("chatbot-send");

  if (!thread || !input || !sendButton) {
    const host = document.querySelector("main .container");
    if (!host) {
      return;
    }

    const card = document.createElement("section");
    card.className = "card stack chatbot-card";
    card.setAttribute("aria-labelledby", "chatbot-title");
    card.setAttribute("data-chatbot-generated", "true");

    card.innerHTML =
      '<h2 id="chatbot-title">Chat Assistant</h2>' +
      "<p>Ask a quick question and get a response.</p>" +
      '<div id="chatbot-thread" class="chatbot-thread" aria-live="polite"></div>' +
      '<div class="stack">' +
      '<label for="chatbot-input">Your message</label>' +
      '<textarea id="chatbot-input" rows="3" placeholder="Type your question here..."></textarea>' +
      "</div>" +
      '<div><button id="chatbot-send" class="btn btn-primary" type="button">GetInTouch</button></div>';

    host.appendChild(card);

    thread = card.querySelector("#chatbot-thread");
    input = card.querySelector("#chatbot-input");
    sendButton = card.querySelector("#chatbot-send");
  }

  if (!thread || !input || !sendButton || sendButton.getAttribute("data-chatbot-bound") === "true") {
    return;
  }

  sendButton.setAttribute("data-chatbot-bound", "true");
  let chatPopup = null;
  const conversationHistory = [];

  const title = document.getElementById("chatbot-title");
  let statusBadge = document.getElementById("chatbot-status-badge");

  if (title && !statusBadge) {
    statusBadge = document.createElement("span");
    statusBadge.id = "chatbot-status-badge";
    statusBadge.className = "chatbot-status-badge";
    title.appendChild(document.createTextNode(" "));
    title.appendChild(statusBadge);
  }

  function setStatus(status, text) {
    if (!statusBadge) {
      return;
    }

    statusBadge.textContent = text;
    statusBadge.className = "chatbot-status-badge status-" + status;
  }

  function appendMessage(role, messageText) {
    const message = document.createElement("p");
    message.className = "chatbot-message " + (role === "user" ? "user-message" : "bot-message");
    message.textContent = messageText;
    thread.appendChild(message);
    thread.scrollTop = thread.scrollHeight;
    return message;
  }

  function buildPrompt(userText) {
    const recentHistory = conversationHistory.slice(-MAX_CONTEXT_MESSAGES);
    if (!recentHistory.length) {
      return userText;
    }

    const transcript = recentHistory
      .map(function mapMessage(message) {
        const speaker = message.role === "user" ? "User" : "Assistant";
        return speaker + ": " + message.text;
      })
      .join("\n");

    return "Conversation so far:\n" + transcript + "\nUser: " + userText + "\nAssistant:";
  }

  function extractModelText(data) {
    if (!data) {
      return "";
    }

    if (typeof data === "string") {
      return data;
    }

    const directKeys = ["answer", "response", "output_text", "output", "message"];
    for (let index = 0; index < directKeys.length; index += 1) {
      const value = data[directKeys[index]];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    if (Array.isArray(data.completion) && data.completion.length) {
      const first = data.completion[0];
      if (typeof first === "string") {
        return first;
      }
    }

    if (Array.isArray(data.content) && data.content.length) {
      const textPart = data.content.find(function findText(part) {
        return part && typeof part.text === "string";
      });
      if (textPart && textPart.text.trim()) {
        return textPart.text;
      }
    }

    if (data.body) {
      if (typeof data.body === "string") {
        try {
          return extractModelText(JSON.parse(data.body));
        } catch (_err) {
          return data.body;
        }
      }

      if (typeof data.body === "object") {
        return extractModelText(data.body);
      }
    }

    return "";
  }

  async function getLiveReply(userText) {
    const headers = {
      "Content-Type": "application/json"
    };

    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const response = await fetch(BEDROCK_PROXY_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        prompt: buildPrompt(userText),
        max_tokens: DEFAULT_MAX_TOKENS,
        temperature: DEFAULT_TEMPERATURE
      })
    });

    if (!response.ok) {
      throw new Error("API request failed with status " + response.status);
    }

    const data = await response.json();
    const modelText = extractModelText(data).trim();

    if (!modelText) {
      throw new Error("No text found in API response payload.");
    }

    return modelText;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getOrOpenChatWindow() {
    if (!chatPopup || chatPopup.closed) {
      chatPopup = window.open("", "hoosierGetInTouchWindow", "width=520,height=640,resizable=yes,scrollbars=yes");
    }
    return chatPopup;
  }

  function renderChatWindow(popup, userText, botText) {
    if (!popup || popup.closed) {
      return;
    }

    const safeUserText = escapeHtml(userText);
    const safeBotText = escapeHtml(botText);
    const safeTime = escapeHtml(new Date().toLocaleTimeString());

    popup.document.open();
    popup.document.write(
      "<!doctype html>" +
      '<html lang="en">' +
      "<head>" +
      '<meta charset="UTF-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      "<title>GetInTouch</title>" +
      "<style>" +
      "body{font-family:Segoe UI,Trebuchet MS,Verdana,sans-serif;margin:0;background:#eaf6ee;color:#1f2937;}" +
      ".wrap{max-width:760px;margin:0 auto;padding:1rem;}" +
      ".head{background:#1e5f4d;color:#fff;padding:0.85rem 1rem;border-radius:0.7rem;}" +
      ".card{margin-top:1rem;background:#f7fcf8;border:1px solid #c8e2cf;border-radius:0.75rem;padding:0.9rem;}" +
      ".user{background:rgba(30,95,77,0.16);}" +
      ".bot{background:rgba(47,133,90,0.14);}" +
      ".meta{font-size:0.85rem;opacity:0.75;margin-top:0.6rem;}" +
      "</style>" +
      "</head>" +
      "<body>" +
      '<main class="wrap">' +
      '<section class="head"><strong>GetInTouch</strong></section>' +
      '<section class="card user"><strong>You:</strong><p>' +
      safeUserText +
      "</p></section>" +
      '<section class="card bot"><strong>Assistant:</strong><p>' +
      safeBotText +
      "</p><p class=\"meta\">Generated locally at " +
      safeTime +
      "</p></section>" +
      "</main>" +
      "</body>" +
      "</html>"
    );
    popup.document.close();
    popup.focus();
  }

  if (!thread.children.length) {
    appendMessage("bot", "Hi, how can I help you today?");
  }

  setStatus("ready", apiKey ? "Live API (API key configured)" : "Live API (no API key)");

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) {
      return;
    }

    const popup = getOrOpenChatWindow();

    appendMessage("user", userText);
    conversationHistory.push({ role: "user", text: userText });
    input.value = "";
    sendButton.disabled = true;
    setStatus("loading", "Contacting model...");

    const waitingMessage = appendMessage("bot", "Please wait...");

    try {
      const botReply = await getLiveReply(userText);
      waitingMessage.textContent = botReply;
      conversationHistory.push({ role: "assistant", text: botReply });
      renderChatWindow(popup, userText, botReply);
      setStatus("connected", "Live API Connected");
    } catch (_error) {
      const fallbackMessage =
        "I could not reach the live assistant right now. Please try again in a moment. " +
        "If this keeps happening, confirm API access and CORS settings.";
      waitingMessage.textContent = fallbackMessage;
      renderChatWindow(popup, userText, fallbackMessage);
      setStatus("disconnected", "Live API Disconnected");
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  sendButton.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function onKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
}
