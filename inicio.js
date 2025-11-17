      // Datos de ejemplo para chats y mensajes
      const chatsData = {
        1: {
          userName: "Juan Pérez",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          messages: [
            { fromMe: false, text: "Hola, ¿cómo estás?" },
            { fromMe: true, text: "¡Hola Juan! Todo bien, ¿y tú?" },
          ],
        },
        2: {
          userName: "María López",
          avatar: "https://randomuser.me/api/portraits/women/10.jpg",
          messages: [
            { fromMe: false, text: "¿Me puedes ayudar con el tutorial?" },
          ],
        },
        3: {
          userName: "Carlos Díaz",
          avatar: "https://randomuser.me/api/portraits/men/98.jpg",
          messages: [
            { fromMe: false, text: "¿Ya viste las últimas novedades?" },
            { fromMe: true, text: "Sí, están geniales!" },
          ],
        },
      };

      const chatToggle = document.getElementById("chatToggle");
      const chatList = document.getElementById("chatList");
      const chatPanel = document.getElementById("chatPanel");
      const chatUserName = document.getElementById("chatUserName");
      const chatMessages = document.getElementById("chatMessages");
      const chatInput = document.getElementById("chatInput");
      const sendBtn = document.getElementById("sendBtn");
      const chatCloseBtn = document.getElementById("chatCloseBtn");

      // Toggle visibilidad lista chats
      chatToggle.addEventListener("click", () => {
        chatList.style.display =
          chatList.style.display === "block" ? "none" : "block";
      });

      // Manejar selección de chat
      function openChat(userId) {
        const chat = chatsData[userId];
        if (!chat) return;

        // Ocultar lista
        chatList.style.display = "none";

        // Mostrar panel chat
        chatPanel.classList.add("active");
        chatUserName.textContent = chat.userName;

        // Limpiar mensajes previos
        chatMessages.innerHTML = "";

        // Cargar mensajes
        chat.messages.forEach((msg) => {
          const messageElem = document.createElement("div");
          messageElem.classList.add("chat-message");
          if (msg.fromMe) {
            messageElem.style.justifyContent = "flex-end";
            messageElem.innerHTML = `<div class="chat-text" style="background:#bd2031">${msg.text}</div>`;
          } else {
            messageElem.innerHTML = `
          <img src="${chat.avatar}" alt="${chat.userName}" class="chat-avatar" />
          <div class="chat-text">${msg.text}</div>
        `;
          }
          chatMessages.appendChild(messageElem);
        });

        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Guardamos id chat activo
        chatPanel.dataset.activeChat = userId;
      }

      // Agregar evento click y teclado a cada chat-list-item
      const chatItems = chatList.querySelectorAll(".chat-list-item");
      chatItems.forEach((item) => {
        item.addEventListener("click", () => {
          openChat(item.dataset.userid);
          // Marcar activo visualmente
          chatItems.forEach((i) => i.classList.remove("active"));
          item.classList.add("active");
          // Actualizar ARIA
          item.setAttribute("aria-selected", "true");
        });
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            item.click();
          }
        });
      });

      // Manejar envío de mensaje
      chatInput.addEventListener("input", () => {
        sendBtn.disabled = chatInput.value.trim() === "";
      });
      sendBtn.addEventListener("click", () => {
        const text = chatInput.value.trim();
        if (!text) return;

        const userId = chatPanel.dataset.activeChat;
        if (!userId) return;

        // Agregar mensaje al DOM
        const messageElem = document.createElement("div");
        messageElem.classList.add("chat-message");
        messageElem.style.justifyContent = "flex-end";
        messageElem.innerHTML = `<div class="chat-text" style="background:#bd2031">${text}</div>`;
        chatMessages.appendChild(messageElem);

        // Scroll abajo
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Limpiar input y desactivar botón
        chatInput.value = "";
        sendBtn.disabled = true;

        // Guardar mensaje en datos (opcional)
        chatsData[userId].messages.push({ fromMe: true, text });
      });

      // Cerrar chat
      chatCloseBtn.addEventListener("click", () => {
        chatPanel.classList.remove("active");
        // Deseleccionar usuarios activos en lista
        chatItems.forEach((i) => {
          i.classList.remove("active");
          i.setAttribute("aria-selected", "false");
        });
        chatInput.value = "";
        sendBtn.disabled = true;
      });