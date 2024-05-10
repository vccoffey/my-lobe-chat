const { app, BrowserWindow } = require("electron")

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // This improves security since you're loading an external page.
    },
  })

  // Replace this line with your desired URL
  mainWindow.loadURL("http://localhost:3210/chat")
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
