// Connect to backend with user email (for private messaging)
const socket = io("http://localhost:3000", {
    query: {
      email: sessionStorage.getItem("userEmail") || "anonymous@example.com"
    }
  });
  
  /* ---------------- GROUP CHAT LOGIC ---------------- */
  let selectedRoom = null;
  const genreSelect = document.getElementById("genreSelect");
  const chatBox = document.getElementById("chatBox");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("message");
  const roomTitle = document.getElementById("roomTitle");
  
  genreSelect?.addEventListener("change", () => {
    selectedRoom = genreSelect.value;
    roomTitle.textContent = `🎶 ${selectedRoom.toUpperCase()} Chat`;
    form.style.display = "block";
    socket.emit("joinRoom", selectedRoom);
  });
  
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (msg && selectedRoom) {
      const username = sessionStorage.getItem("userName") || "Guest";
      socket.emit("chatMessage", {
        room: selectedRoom,
        message: `${username}: ${msg}`,
      });
      input.value = "";
    }
  });
  
  socket.on("chatMessage", (msg) => {
    const p = document.createElement("p");
    p.textContent = msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
  
  socket.on("roomHistory", (history) => {
    chatBox.innerHTML = "";
    history.forEach((msg) => {
      const p = document.createElement("p");
      p.textContent = msg;
      chatBox.appendChild(p);
    });
  });
  
  /* ---------------- PRIVATE CHAT LOGIC ---------------- */
  let privateTargetEmail = null;
  const privateChatBox = document.getElementById("privateChatBox");
  const privateTitle = document.getElementById("privateChatTitle");
  const privateMessages = document.getElementById("privateChatMessages");
  const privateInput = document.getElementById("privateMessage");
  const privateForm = document.getElementById("privateChatForm");
  
  // Open private chat when a user is clicked
  window.openPrivateChat = function (email) {
    privateTargetEmail = email;
    privateChatBox.style.display = "block";
    privateTitle.textContent = `Private chat with ${email}`;
    privateMessages.innerHTML = ""; // Reset old messages (no history yet)
  };
  
  // Send private message
  privateForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = privateInput.value.trim();
    if (msg && privateTargetEmail) {
      const username = sessionStorage.getItem("userName") || "Guest";
      const fullMsg = `${username} (private): ${msg}`;
  
      socket.emit("privateMessage", {
        to: privateTargetEmail,
        message: fullMsg,
        sender: sessionStorage.getItem("userEmail")
      });
  
      // Only display for sender
      appendPrivateMessage(fullMsg, true);
      privateInput.value = "";
    }
  });
  
  // Receive private message
  socket.on("privateMessage", ({ message, sender }) => {
    const myEmail = sessionStorage.getItem("userEmail");
    if (sender === myEmail) return; // skip if sent by self (already appended)
    appendPrivateMessage(message, false);
  });
  
  //  Append message helper
  function appendPrivateMessage(message, isSender = false) {
    const p = document.createElement("p");
    p.textContent = message;
    if (isSender) p.style.fontStyle = "italic"; // optional style for sender
    privateMessages.appendChild(p);
    privateMessages.scrollTop = privateMessages.scrollHeight;
  }
  