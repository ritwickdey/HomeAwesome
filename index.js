;
(function () {
    'use strict'

    if (!Typed || !moment || !jQuery) {
        console.error("Error to load");
        return;
    }

    let toggleClock = true;
    const timeDigitalElem = document.getElementById('timeDigital');
    const timeAnalogElem = document.getElementById('timeAnalog');
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
        else (hrs >= 17 && hrs <= 24)
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

    timeDigitalElem.onclick = (event) => {
        event.stopPropagation();
        timeFormatIndex = (timeFormatIndex + 1) % timeFormats.length;
        updateTimeBySec();
    };

    let updateAnalogClock = () => {
        let time = moment();

        let secs = time.seconds() * 360 / 60;
        let mins = time.minutes() * 360 / 60 + secs / 60;
        let hrs = (time.hours() % 12) * 360 / 12 + mins / 12;

        timeAnalogElem.querySelector('#sec').style.transform = `rotate(${secs}deg)`;
        timeAnalogElem.querySelector('#min').style.transform = `rotate(${mins}deg)`;
        timeAnalogElem.querySelector('#hrs').style.transform = `rotate(${hrs}deg)`;
    }

    setInterval(() => {
        updateAnalogClock();
    }, 1000);

    updateAnalogClock();

    let toggleClockType = () => {
        if (toggleClock) {
            timeDigitalElem.classList.add('hide');
            timeAnalogElem.classList.remove('hide');
        } else {
            timeDigitalElem.classList.remove('hide');
            timeAnalogElem.classList.add('hide');
        }
        toggleClock = !toggleClock;
    }

    toggleClockType();

    document.body.onclick = () => {
        toggleClockType();
    }

    // var bingImagesUrl = "http://bing.com/HPImageArchive.aspx";
    // $.getJSON( bingImagesUrl, {
    //   idx:0,
    //   n:1,
    //   format: "js"
    // }).done(function( data ) {
    //       $('#output').html(data.images[0].url);
    // });
    



    

   
    {
        // document.body.style.backgroundImage = "url(./img/homeAwesome3.png)"
    }

})();