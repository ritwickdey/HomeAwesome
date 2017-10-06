'use strict'
const username = document.getElementById("name");
const greetingMsgs = document.getElementById("msg");
const clocksBtns = document.getElementsByName('clock');

function saveOptions(e) {
    let checkedClock = [...clocksBtns].find(e => e.checked);
    let options = {
        username: username.value.trim(),
        greetingMsgs: greetingMsgs.value.trim().split(','),
        clock: checkedClock ? checkedClock.value : 'analogClock'
    }
    localStorage.setItem('options', JSON.stringify(options));
    e.preventDefault();
    chrome.runtime.sendMessage({ status: 'options-modified', options: options });
    window.close();
}

function restoreOptions() {
    let options = localStorage.getItem('options');
    if (options) {
        options = JSON.parse(options);
        username.value = options.username;
        greetingMsgs.value = options.greetingMsgs;
        [...clocksBtns].find(e => e.value === (options.clock || 'analogClock')).checked = true;
    }

}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

