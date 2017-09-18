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
        else (hrs >= 17 && hrs <= 24)
            return 'Good Evening.';

    }

    let options = {
        strings: ["","Hi there...", getGettingMsg(), "It's really awesome. ^200 Isn't it? ", "Fork me on GitHub to add features"],
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

})();