// Wait for the page to load
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("commandInput");
    const outputDiv = document.getElementById("output");

    const commands = {
        help: "Available commands: <br> - help <br> - status <br> - clear",
        status: "System status: Online. All functions operational.",
        clear: "clear"
    };

    // Animate initial messages
    typeText("Initializing system...", outputDiv, function() {
        typeText("Accessing mainframe...", outputDiv, function() {
            typeText("Welcome, Operator. Type 'help' for a list of commands", outputDiv);
        });
    });

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let userInput = inputField.value.trim().toLowerCase();
            inputField.value = "";

            let userLine = document.createElement("p");
            userLine.innerHTML = `> ${userInput}`;
            outputDiv.appendChild(userLine);

            if (commands[userInput]) {
                if (commands[userInput] === "clear") {
                    outputDiv.innerHTML = ""; // Clears the terminal
                } else {
                    typeText(commands[userInput], outputDiv);
                }
            } else {
                typeText("Error: Command not recognized.", outputDiv);
            }

            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
    });

    function typeText(text, targetElement, callback) {
        let responseLine = document.createElement("p");
        responseLine.classList.add("typing");
        targetElement.appendChild(responseLine);
        let index = 0;
    
        function type() {
            if (index < text.length) {
                responseLine.innerHTML = text.substring(0, index + 1) + "<span class='cursor'>|</span>";
                index++;
                setTimeout(type, 50);
            } else {
                responseLine.classList.remove("typing");
                if (callback) callback();
            }
        }
    
        type();
    }
});

