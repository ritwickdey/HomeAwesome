'use strict'
const username = document.getElementById("name");
const greetingMsgs = document.getElementById("msg");
const clocksBtns = document.getElementsByName('clock');

function saveOptions(e) {
    let checkedClock = [...clocksBtns].find(e => e.checked);
    chrome.storage.sync.set({
        options: {
            username: username.value.trim(),
            greetingMsgs: greetingMsgs.value.trim(),
            clock: checkedClock ? checkedClock.value : 'analogClock'
        }
    });
    e.preventDefault();
    window.close();
}

function restoreOptions() {
    chrome.storage.sync.get('options', (storedValue) => {
        if (storedValue) {
            console.log(storedValue);
            username.value = storedValue.options.username;
            greetingMsgs.value = storedValue.options.greetingMsgs;
            [...clocksBtns].find(e => e.value === (storedValue.options.clock || 'analogClock')).checked = true;
        }
    });
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

