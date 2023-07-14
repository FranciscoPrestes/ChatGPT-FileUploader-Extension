
function createFileInput() {

  // Create 'Submit File' button and add styles
  const btn = document.createElement('button');
  btn.textContent = 'Chico Upload (Beta)';
  btn.style.backgroundImage = 'linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)';
  btn.style.backgroundColor = 'blue';
  btn.style.fontWeight = 'bold'
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
  progressBar.style.fontWeight = 'bold';
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

function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
  
    // Mostrar overflow no input de texto
    let textareaStyles = textarea.getAttribute("style").split(";");
    textareaStyles.forEach((element, index) => {
      textareaStyles[index] = element.trim();
    });
  
    let overflowOffIndex = textareaStyles.indexOf("overflow-y: hidden");
  
    if (overflowOffIndex !== -1) {
      textareaStyles.splice(overflowOffIndex);
      textarea.setAttribute("style", textareaStyles.join(';'));
    }
  
    let submitButton = document.querySelector("button.absolute.p-1.rounded-md");
  
    // Habilitar o botão de envio se estiver desabilitado
    let isDisabled = submitButton.hasAttribute("disabled");
    if (isDisabled) {
      submitButton.removeAttribute('disabled');
    }
  
    const spaceKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 32, // Código da tecla de espaço
    });
    
    const enterKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13, // Código da tecla Enter
    });
  
    // Adicionar novo evento de tecla sem remover os eventos existentes
    textarea.addEventListener("keydown", (event) => {
      // Se for a tecla de espaço ou Enter, não impedir o comportamento padrão
      if (event.keyCode !== 32 && event.keyCode !== 13) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  
    // Definir o valor do textarea
    textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
  
    // Disparar evento de tecla de espaço
    textarea.focus();
    textarea.dispatchEvent(spaceKeyEvent);
  
    // Disparar evento de tecla Enter
    textarea.dispatchEvent(enterKeyEvent);
  
    // Clicar no botão de envio
    submitButton.click();
  }
  

  // Attach click event listener to the button
  btn.addEventListener('click', function () {
    // Create input element for file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.js,.py,.html,.css,.json,.csv';

    // Listen for changes to the file input
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function () {
        const text = reader.result;
        const chunkSize = 4098;
        const numChunks = Math.ceil(text.length / chunkSize);

        for (let i = 0; i < numChunks; i++) {
          const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
          submitConversation(chunk, i + 1, file.name);

          // Update the progress bar
          let percentComplete = ((i + 1) / numChunks) * 100;
          progressBar.style.width = `${percentComplete}%`;
          progressBar.textContent = `${percentComplete.toFixed(2)}%  `;


          // Check if ChatGPT is ready
          let chatgptReady = false;
          while (!chatgptReady) {
             new Promise((resolve) => setTimeout(resolve, 1000));
            {
              const elementos = document.querySelectorAll('.btn.relative.btn-neutral div.flex.w-full.gap-2.items-center.justify-center');

              elementos.forEach((elemento) => {

                if (elemento.textContent == 'Stop generating') {
                  chatgptReady = false;
                }
                else {
                  chatgptReady = true;
                }
              });


            }


          }
        }
        // Change progress bar color to blue after all chunks are submitted
        progressBar.style.backgroundImage = 'linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%)';
        progressBar.style.backgroundColor = 'blue';
      }
    });

    // Trigger the file input click event
    fileInput.click();
  });

}

// Call the function to create and append the file input element
createFileInput();