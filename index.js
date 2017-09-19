;
(function () {
    'use strict'

    if (!Typed || !moment) {
        console.error("Error to load");
        return;
    }

    const timeDigitalElem = document.getElementById('timeDigital');
    const timeFormats = [
        "hh:mm:ss a",
        "hh:mm a",
        "hh:mm:ss",
        "HH:mm:ss",
        "hh:mm a",
        "HH:mm a",
        "hh:mm",
        "HH:mm"
    ];
    let timeFormatIndex = 0;

    let getGettingMsg = () => {
        let hrs = (new Date()).getHours();
        
        if (hrs < 12)
            return 'Good Morning.';
        else if (hrs >= 12 && hrs <= 17)
            return 'Good Afternoon.';
        else(hrs >= 17 && hrs <= 24)
        return 'Good Evening.';

    }

    let options = {
        strings: ["", "Hi there...^600", getGettingMsg() + "^600", "Fork me on GitHub to add features.^600"],
        typeSpeed: 35,
        smartBackspace: true,

        backSpeed: 20,
        loop: true,
        loopCount: Infinity,
        showCursor: true,
        cursorChar: '|'
    }

    let typed = new Typed("#welcomeMsg", options);

    let updateTimeBySec = () => {
        timeDigitalElem.innerText = moment().format(timeFormats[timeFormatIndex]);
    };

    setInterval(() => {
        updateTimeBySec();
    }, 1000);

    updateTimeBySec();

    timeDigitalElem.setAttribute('title', 'Click to change time format');
    
    timeDigitalElem.onclick = () => {
        timeFormatIndex = (timeFormatIndex+1)%timeFormats.length;
        updateTimeBySec();
    };

    


})();