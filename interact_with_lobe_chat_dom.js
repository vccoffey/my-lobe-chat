// Function to find the div with specific attributes and return desired information
const findMicDivWithStatus = () => {
  // Check for the presence of the 'lucide-mic-off' icon within the div
  const micOffIcon = document.querySelector("svg.lucide-mic-off")
  const micOnIcon = document.querySelector("svg.lucide-mic")

  const divElement = (micOffIcon || micOnIcon).parentElement
  // Return the div and true if the mic-off icon is present, false otherwise
  return [divElement, Boolean(micOffIcon)]
}

const focusMainChatInput = () =>
  document.querySelector("textarea[autofocus]").focus()

const focusMainChatInputAndTurnOffMic = () => {
  focusMainChatInput()
  const [micDiv, isRecording] = findMicDivWithStatus()
  if (!micDiv) return console.error("Mic div not found")
  if (!isRecording) return

  console.log("Turning off the mic...")
  micDiv.click()
}

const focusMainChatInputAndTurnOnMic = () => {
  focusMainChatInput()
  const [micDiv, isRecording] = findMicDivWithStatus()
  if (!micDiv) return console.error("Mic div not found")
  if (isRecording) return

  console.log("Turning on the mic...")
  micDiv.click()
}

module.exports = {
  focusMainChatInputAndTurnOffMic,
  focusMainChatInputAndTurnOnMic,
}
