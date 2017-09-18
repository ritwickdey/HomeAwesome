;
(function () {
    'use strict'

    if (!Typed) {
        console.error("Typed.Js is not found.");
        return;
    }

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
        strings: ["", "Hi there...", getGettingMsg(), "It's really awesome. ^200 Isn't it? ", "Fork me on <a href='https://github.com/ritwickdey/HomeAwesome'>GitHub<a> to add features ^200"],
        typeSpeed: 40,
        smartBackspace: true,

        backSpeed: 20,
        shuffle: !true,
        loop: true,
        loopCount: Infinity,
        showCursor: !false,
        cursorChar: '|'
    }

    let typed = new Typed("#welcomeMsg", options);

    let updateTimeBySec = setInterval(() => {
            let timeElem = document.getElementById('time');
            timeElem.innerText = moment().format("hh:mm:ss a");;
    }, 1000);


    updateTimeBySec();

})();