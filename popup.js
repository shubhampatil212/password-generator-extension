document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.getElementById("password");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");
  const pasteButton = document.getElementById("paste");

  // Function to generate a random password
  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  // Generate button functionality
  generateButton.addEventListener("click", () => {
    const newPassword = generatePassword();
    passwordField.value = newPassword;

    // Automatically copy the generated password to the clipboard
    navigator.clipboard.writeText(newPassword).then(() => {
      console.log("Password copied to clipboard!");
    });
  });

  // Copy button functionality
  copyButton.addEventListener("click", () => {
    const password = passwordField.value;
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        alert("Password copied to clipboard!");
      });
    } else {
      alert("Generate a password first!");
    }
  });

  // Paste button functionality
  pasteButton.addEventListener("click", () => {
    // Use clipboard API to paste the password directly into a password field on the webpage
    navigator.clipboard.readText().then((clipboardText) => {
      // Locate a password field in the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: (text) => {
              const passwordInput = document.querySelector("input[type='password']");
              if (passwordInput) {
                passwordInput.value = text;
              } else {
                alert("No password field found on the page!");
              }
            },
            args: [clipboardText],
          },
          () => {
            console.log("Password pasted into the form!");
          }
        );
      });
    });
  });
});
