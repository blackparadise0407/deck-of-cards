var MicroModal = window.MicroModal;
var socket = window.socket;

/**
 *
 * @param {string} title
 * @param {(content: HTMLElement, close: () => void) => void | undefined} render
 * @returns {void}
 */
function dialog(title, render) {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector("#modal-content");
  const modalTitle = modal.querySelector("#modal-title");
  modalTitle.textContent = title;
  modalContent.innerHTML = "";
  if (render) {
    render(modalContent, () => {
      MicroModal.close("modal");
    });
  }
  MicroModal.show("modal");
}

/**
 *
 * @param {string} roomId
 */
function enterMultiDialog(roomId) {
  dialog("Tên bạn là zì", (content, close) => {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Your name";
    content.appendChild(input);
    const button = document.createElement("button");
    button.textContent = "Enter";
    button.className = "button";
    const uid = (Date.now() + Math.floor(Math.random() * 100000)).toString(16);
    button.onclick = () => {
      if (input.value) {
        socket.emit("join-room", {
          roomId: roomId || uid,
          player: {
            id: sessionStorage.getItem("__uid"),
            name: input.value,
          },
        });
        sessionStorage.setItem("__roomId", roomId || uid);
        close();
      }
    };
    if (!roomId) {
      const clipboardButton = document.createElement("button");
      clipboardButton.className = "button";
      clipboardButton.textContent = "Copy link";
      clipboardButton.onclick = () => {
        navigator.clipboard.writeText(location.origin + `/cao/${uid}`);
      };
      content.appendChild(clipboardButton);
    }
    content.appendChild(button);
  });
}

const utils = {
  dialog,
  enterMultiDialog,
};
export default utils;
