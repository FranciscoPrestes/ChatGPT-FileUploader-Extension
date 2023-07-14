// Create 'Submit File' button and add styles
const btn = document.createElement('button');
btn.textContent = 'Chico Upload (Beta)';
btn.style.backgroundImage = 'linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)';
btn.style.backgroundColor = 'blue';
btn.style.fontWeight ='bold'
btn.style.color = 'white';
btn.style.padding = '5px';
btn.style.border = 'none';
btn.style.borderRadius = '5px';
btn.style.margin = '5px';

// Create progress element and its child 'progress bar' div
const progressElement = document.createElement('div');
progressElement.style.width = '99%';
progressElement.style.height = '15px';
progressElement.style.backgroundColor = 'grey';

const progressBar = document.createElement('div');
progressBar.textContent = '0%';
progressBar.style.textAlign = 'right';
progressBar.style.color = 'white';  
progressBar.style.fontSize = '10px';
progressBar.style.fontWeight ='bold';
progressBar.style.width = '0%';
progressBar.style.transition = 'width 0.5s ease-in-out';
progressBar.style.backgroundImage = 'linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)';
progressBar.style.backgroundColor = 'blue';
progressElement.appendChild(progressBar);

// Get the target element to insert before
const targetElement = document.querySelector('.px-3.pb-3.pt-2.text-center.text-xs.text-gray-600');

// Insert the elements into the DOM
targetElement.parentNode.insertBefore(btn, targetElement);
targetElement.parentNode.insertBefore(progressElement, targetElement);

async function submitConversation(text, part, filename) {

  const textarea = document.querySelector("textarea[tabindex='0']");

  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}

// Attach click event listener to the button
btn.addEventListener('click', function () {
  // Create input element for file
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.js,.py,.html,.css,.json,.csv';

  // Listen for changes to the file input
  fileInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async function () {
      const text = reader.result;
      const chunkSize = 4098;
      const numChunks = Math.ceil(text.length / chunkSize);

      for (let i = 0; i < numChunks; i++) {
        const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
        await submitConversation(chunk, i + 1, file.name);

        // Update the progress bar
        let percentComplete = ((i + 1) / numChunks) * 100;
        progressBar.style.width = `${percentComplete}%`;
        progressBar.textContent = `${percentComplete.toFixed(2)}%  `;
       

        // Check if ChatGPT is ready
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
        }
      }
      // Change progress bar color to blue after all chunks are submitted
      progressBar.style.backgroundColor = 'blue';
    }
  });

  // Trigger the file input click event
  fileInput.click();
});