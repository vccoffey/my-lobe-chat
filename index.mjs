import { app, globalShortcut, BrowserWindow, ipcMain } from "electron"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"
import http from "http"
import { registerShortcut } from "./shortcutManager.mjs"

const SHORTCUT_FOCUS_AND_TURN_OFF_MIC = "Command+Option+A"
const SHORTCUT_FOCUS_AND_TURN_ON_MIC = "Shift+Command+Option+A"

function startLobeChatDockerImage() {
  exec(
    "docker run -d -p 3210:3210 lobehub/lobe-chat",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`Container ID: ${stdout}`)
    }
  )
}

function stopLobeChatDockerImage() {
  exec(
    "docker stop $(docker ps -q --filter ancestor=lobehub/lobe-chat)",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log("Container stopped successfully.")
    }
  )
}

function createWindow() {
  const preload = `${dirname(fileURLToPath(import.meta.url))}/preload.js`

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // This improves security since you're loading an external page.
      contextIsolation: true, // Enable context isolation for additional security.
      preload,
    },
  })

  mainWindow
    .loadURL("http://localhost:3210/chat")
    .then(() => onWindowReady(mainWindow))

  mainWindow.on("closed", () => {})

  // Open the DevTools optionally:
  // mainWindow.webContents.openDevTools()
}

function checkServerReady(retryCount = 0, maxRetries = 30) {
  const options = {
    host: "localhost",
    port: 3210,
    path: "/", // Using the base URL
    timeout: 2000,
  }

  if (retryCount >= maxRetries) {
    console.error("Server did not become ready in time. Max retries exceeded.")
    return
  }

  const request = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log("Server is ready.")
      createWindow()
    } else {
      console.log(
        `Server not ready, status code: ${res.statusCode}, retrying...`
      )
      setTimeout(() => checkServerReady(retryCount + 1, maxRetries), 2000)
    }
  })

  request.on("error", (err) => {
    console.log(
      `Error checking server status, retrying... Error: ${err.message}`
    )
    setTimeout(() => checkServerReady(retryCount + 1, maxRetries), 2000)
  })

  request.end()
}

function onWindowReady(mainWindow) {
  console.log("Registering shortcuts...")
  registerShortcut(
    SHORTCUT_FOCUS_AND_TURN_ON_MIC,
    (win) => win.webContents.send("focus-input-and-turn-on-mic"),
    mainWindow
  )
  registerShortcut(
    SHORTCUT_FOCUS_AND_TURN_OFF_MIC,
    (win) => win.webContents.send("focus-input-and-turn-off-mic"),
    mainWindow
  )
  console.log("Shortcuts registered.")
}

app.on("ready", () => {
  startLobeChatDockerImage()
  checkServerReady()
})

app.on("window-all-closed", app.quit)

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
  ipcMain.removeAllListeners()
  stopLobeChatDockerImage()
  console.log("Finished cleanup. Quitting.")
})
