console.log("Preload script starting...")

const { ipcRenderer } = require("electron")

const findMicWithStatus = () => {
  const micOffIcon = document.querySelector("svg.lucide-mic-off") // shown when recording is active
  const micOnIcon = document.querySelector("svg.lucide-mic") // shown when recording is inactive

  const element = (micOffIcon || micOnIcon).parentNode
  return [element, micOffIcon ? true : false]
}

const focusMainChatInput = () =>
  document.querySelector("textarea[autofocus]").focus()

const focusMainChatInputAndTurnOffMic = () => {
  focusMainChatInput()
  const [clickableMic, isRecording] = findMicWithStatus()
  if (isRecording) {
    if (clickableMic) {
      console.log("Turning off the mic...", clickableMic, isRecording)
      clickableMic.click()
    } else console.log("Mic not found.")
  } else console.log("Mic is already off.")
}

const focusMainChatInputAndTurnOnMic = () => {
  focusMainChatInput()
  const [clickableMic, isRecording] = findMicWithStatus()
  if (clickableMic) {
    if (isRecording) {
      console.log("Mic is already on.")
    } else {
      console.log("Turning on the mic...", clickableMic, isRecording)
      clickableMic.click()
    }
  } else console.log("Mic not found.")
}

console.log("Preload script loaded.")

ipcRenderer.on("focus-input-and-turn-on-mic", focusMainChatInputAndTurnOnMic)
ipcRenderer.on("focus-input-and-turn-off-mic", focusMainChatInputAndTurnOffMic)
