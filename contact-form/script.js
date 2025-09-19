// Contact Form
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const messageList = document.getElementById("messageList");
let messages = JSON.parse(localStorage.getItem("messages")) || [];

// Initial Display of Messages
function displayMessages() {
  if (messages.length === 0) {
    messageList.innerHTML = "<li>No messages yet</li>";
  } else {
    messageList.innerHTML = messages
      .map(
        (message) => `
            <li>
                <strong>From:</strong> ${message.name} (${message.email})<br>
                <strong>Message:</strong> ${message.message}<br>
                <small>Sent: ${new Date(
                  message.timestamp
                ).toLocaleString()}</small>
                <span class="delete-btn" data-id="${message.id}">Delete</span>
            </li>
        `
      )
      .join("");
  }
}

// Real-Time Validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;
  formMessage.innerHTML = "";

  if (name.length < 2) {
    formMessage.innerHTML += "Name must be at least 2 characters.<br>";
    isValid = false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    formMessage.innerHTML += "Email must be valid.<br>";
    isValid = false;
  }

  if (message.length < 10) {
    formMessage.innerHTML += "Message must be at least 10 characters.<br>";
    isValid = false;
  }

  return isValid;
}

// Submit Form
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateForm()) {
    const newMessage = {
      id: Date.now(),
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
      timestamp: new Date(),
    };

    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));
    displayMessages();

    formMessage.innerHTML = "Message submitted successfully!";
    contactForm.reset();
  }
});

// Event Delegation for Deleting Messages
messageList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const messageId = event.target.getAttribute("data-id");
    messages = messages.filter((message) => message.id !== Number(messageId));
    localStorage.setItem("messages", JSON.stringify(messages));
    displayMessages();
  }
});

// Debounced Validation
let debounceTimeout;
document.getElementById("name").addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(validateForm, 300);
});
document.getElementById("email").addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(validateForm, 300);
});
document.getElementById("message").addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(validateForm, 300);
});

// Display Messages on Load
displayMessages();
