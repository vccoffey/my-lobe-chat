import { globalShortcut } from "electron"

/**
 * Registers a global shortcut.
 * @param {string} shortcutCombination - The keyboard combination (e.g., 'CommandOrControl+X').
 * @param {Function} callback - The function to execute when the shortcut is triggered.
 * @param {BrowserWindow} mainWindow - The main window instance to focus or send IPC messages.
 */

export const registerShortcut = (shortcutCombination, callback, mainWindow) => {
  const ret = globalShortcut.register(shortcutCombination, () => {
    console.log(`${shortcutCombination} is pressed`)

    if (!mainWindow) {
      console.error("Main window is not available.")
      return
    }

    if (!mainWindow.isFocused()) mainWindow.focus() // Attempt to focus the window

    console.log("calling the callback...")
    callback(mainWindow)
  })

  if (!ret) console.error(`Registration failed for ${shortcutCombination}`)
  console.log(
    `${shortcutCombination} is Registered:`,
    globalShortcut.isRegistered(shortcutCombination)
  )
}
