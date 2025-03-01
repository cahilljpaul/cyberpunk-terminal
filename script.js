document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("commandInput");
    const outputDiv = document.getElementById("output");

    const commands = {
        help: "Available commands: <br> - help <br> - status <br> - clear",
        status: "System status: Online. All functions operational.",
        clear: "clear"
    };

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const userInput = inputField.value.trim().toLowerCase();
            inputField.value = "";

            const userLine = document.createElement("p");
            userLine.innerHTML = `> ${userInput}`;
            outputDiv.appendChild(userLine);

            // Create "Processing..." animation
            const processingText = document.createElement("p");
            processingText.innerHTML = "Processing.";
            outputDiv.appendChild(processingText);

            const processingInterval = startProcessingAnimation(processingText);

            setTimeout(() => {
                clearInterval(processingInterval); // Stop animation
                processingText.innerHTML = "✅ Processing complete!";

                setTimeout(() => {
                    handleCommand(userInput, outputDiv, commands);
                }, 1000); // Delay before showing the response

            }, 3000); // Processing time before response appears

            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
    });

    function startProcessingAnimation(element) {
        let dots = 0;
        return setInterval(() => {
            dots = (dots + 1) % 4; // Cycle through 0-3 dots
            element.innerHTML = "Processing" + ".".repeat(dots);
        }, 500); // Speed of dot animation
    }

    function handleCommand(command, outputDiv, commands) {
        if (commands.hasOwnProperty(command)) {
            if (commands[command] === "clear") {
                outputDiv.innerHTML = ""; // Clears terminal
            } else {
                typeText(commands[command], outputDiv);
            }
        } else {
            // Do nothing for unrecognized commands
            // Optionally, you can provide a different response or log it
            // typeText("⚠️ Error: Command not recognized.", outputDiv);
        }

        // After response, ask user to copy text
        const copyPrompt = document.createElement("p");
        copyPrompt.innerHTML = "📋 Press CTRL+C to copy.";
        outputDiv.appendChild(copyPrompt);
    }

    function typeText(text, targetElement) {
        const responseLine = document.createElement("p");
        targetElement.appendChild(responseLine);
        let index = 0;

        function type() {
            if (index < text.length) {
                responseLine.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 50); // Typing speed
            }
        }

        type();
    }
});
