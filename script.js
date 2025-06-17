document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("commandInput");
    const outputDiv = document.getElementById("output");
    let commandHistory = [];
    let historyIndex = -1;

    // Virtual file system
    const fileSystem = {
        root: {
            type: 'directory',
            contents: {
                'readme.txt': {
                    type: 'file',
                    content: 'Welcome to Cyberpunk Terminal v1.0\n\nThis is a simulated terminal environment.\nType "help" for available commands.'
                },
                'docs': {
                    type: 'directory',
                    contents: {}
                }
            }
        }
    };

    let currentPath = ['root'];

    const commands = {
        help: `Available commands:
- help: Show this help message
- clear: Clear the terminal
- ls: List directory contents
- cd [dir]: Change directory
- cat [file]: Display file contents
- pwd: Show current directory
- date: Show current date and time
- echo [text]: Display text
- mkdir [name]: Create directory
- touch [name]: Create file
- rm [name]: Remove file or directory
- history: Show command history`,
        
        clear: "clear",
        
        ls: function() {
            const currentDir = getCurrentDirectory();
            let output = '';
            for (let item in currentDir.contents) {
                const type = currentDir.contents[item].type === 'directory' ? '📁' : '📄';
                output += `${type} ${item}\n`;
            }
            return output || 'Directory is empty';
        },

        cd: function(args) {
            if (!args) return 'Usage: cd [directory]';
            if (args === '..') {
                if (currentPath.length > 1) {
                    currentPath.pop();
                    return `Changed to directory: ${currentPath.join('/')}`;
                }
                return 'Already at root directory';
            }
            
            const currentDir = getCurrentDirectory();
            if (currentDir.contents[args] && currentDir.contents[args].type === 'directory') {
                currentPath.push(args);
                return `Changed to directory: ${currentPath.join('/')}`;
            }
            return `Directory not found: ${args}`;
        },

        cat: function(args) {
            if (!args) return 'Usage: cat [file]';
            const currentDir = getCurrentDirectory();
            if (currentDir.contents[args] && currentDir.contents[args].type === 'file') {
                return currentDir.contents[args].content;
            }
            return `File not found: ${args}`;
        },

        pwd: function() {
            return currentPath.join('/');
        },

        date: function() {
            return new Date().toLocaleString();
        },

        echo: function(args) {
            return args || '';
        },

        mkdir: function(args) {
            if (!args) return 'Usage: mkdir [name]';
            const currentDir = getCurrentDirectory();
            if (currentDir.contents[args]) {
                return `Directory already exists: ${args}`;
            }
            currentDir.contents[args] = {
                type: 'directory',
                contents: {}
            };
            return `Created directory: ${args}`;
        },

        touch: function(args) {
            if (!args) return 'Usage: touch [name]';
            const currentDir = getCurrentDirectory();
            if (currentDir.contents[args]) {
                return `File already exists: ${args}`;
            }
            currentDir.contents[args] = {
                type: 'file',
                content: ''
            };
            return `Created file: ${args}`;
        },

        rm: function(args) {
            if (!args) return 'Usage: rm [name]';
            const currentDir = getCurrentDirectory();
            if (!currentDir.contents[args]) {
                return `File or directory not found: ${args}`;
            }
            delete currentDir.contents[args];
            return `Removed: ${args}`;
        },

        history: function() {
            return commandHistory.join('\n');
        }
    };

    function getCurrentDirectory() {
        let current = fileSystem;
        for (let dir of currentPath) {
            current = current[dir].contents;
        }
        return current;
    }

    inputField.addEventListener("keydown", function (event) {
        // Handle up/down arrow keys for command history
        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                inputField.value = "";
            }
        } else if (event.key === "Enter") {
            const userInput = inputField.value.trim();
            if (userInput) {
                commandHistory.push(userInput);
                historyIndex = -1;
            }
            inputField.value = "";

            const userLine = document.createElement("p");
            userLine.innerHTML = `> ${userInput}`;
            outputDiv.appendChild(userLine);

            const processingText = document.createElement("p");
            processingText.innerHTML = "Processing.";
            outputDiv.appendChild(processingText);

            const processingInterval = startProcessingAnimation(processingText);

            setTimeout(() => {
                clearInterval(processingInterval);
                processingText.innerHTML = "✅ Processing complete!";

                setTimeout(() => {
                    handleCommand(userInput, outputDiv, commands);
                }, 1000);

            }, 1000); // Reduced processing time for better UX

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

    function handleCommand(input, outputDiv, commands) {
        const [command, ...args] = input.toLowerCase().split(' ');
        const argsString = args.join(' ');

        if (commands.hasOwnProperty(command)) {
            if (commands[command] === "clear") {
                outputDiv.innerHTML = "";
            } else if (typeof commands[command] === "function") {
                typeText(commands[command](argsString), outputDiv);
            } else {
                typeText(commands[command], outputDiv);
            }
        } else {
            typeText(`⚠️ Command not found: ${command}. Type 'help' for available commands.`, outputDiv);
        }

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
