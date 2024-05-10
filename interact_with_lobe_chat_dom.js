// Function to find the div with specific attributes and return desired information
const findMicDivWithStatus = () => {
  // Adjust the selector as per your specific requirements
  const divSelector =
    'div[style="border-radius:5px;height:36px;width:36px;flex:none"]'
  const divElement = document.querySelector(divSelector)

  if (!divElement) return [null, false] // Div not found

  // Check for the presence of the 'lucide-mic-off' icon within the div
  const micOffIcon = divElement.querySelector("svg.lucide-mic-off")

  // Return the div and true if the mic-off icon is present, false otherwise
  return [divElement, Boolean(micOffIcon)]
}

const focusMainChatInput = () =>
  document.querySelector("textarea[autofocus]").focus()

const focusMainChatInputAndTurnOffMic = () => {
  focusMainChatInput()
  const [micDiv, isRecording] = findMicDivWithStatus()
  console.log("Turning off the mic...", micDiv, isRecording)
  if (micDiv && isRecording) micDiv.click()
}

const focusMainChatInputAndTurnOnMic = () => {
  focusMainChatInput()
  const [micDiv, isRecording] = findMicDivWithStatus()
  if (micDiv && !isRecording) micDiv.click()
}

module.exports = {
  focusMainChatInputAndTurnOffMic,
  focusMainChatInputAndTurnOnMic,
}
