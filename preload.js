const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args);
    },
    on: (channel, func) => {
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
    },
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    removeListener: (channel, func) => {},
  },
  getSoundPath: (soundFileName) => ipcRenderer.invoke("get-sound-path", soundFileName),
  playSound: (soundFilePath) => {
    const audio = new Audio(soundFilePath);
    audio.play().catch((e) => console.error("Error playing sound:", e));
  },
  getOverlayBidLocked: () => ipcRenderer.invoke("get-overlayBidLocked"),
  getOverlayTimersLocked: () => ipcRenderer.invoke("get-overlayTimersLocked"),
  getActiveTimers: () => ipcRenderer.invoke("get-activeTimers"),
  startFileWatch: () => ipcRenderer.send("start-file-watch"),
  readItemsData: () => ipcRenderer.invoke("read-itemsData"),
  getTriggers: () => ipcRenderer.invoke("get-triggers"),
});

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      ipcRenderer.send("close-itemDetailsWindow");
    }
  });
});
