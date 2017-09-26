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

    chrome.storage.local.get('cacheImgUrls', (result) => {
        if (result.cacheImgUrls && result.cacheImgUrls.cachedate && (Date.now() - result.cacheImgUrls.cachedate) < 86400000) {
            setBackgroudImage(result.cacheImgUrls.links)
            return;
        }

        $.ajax({
            url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=d1d1d944fa904d542998ba2d930ee84d&extras=original_format%2C+url_k%2C+url_h%2C+url_b&per_page=10&format=json&nojsoncallback=1&auth_token=72157688828719026-60f0822e8c0cf235&api_sig=a0484e62b90a9e00064a511a91eea331",
            method: "GET",
            cache: true,
            success: (result) => {
                let photoList = result.photos.photo.map(e => {
                    let urlsetup = `https://farm${e.farm}.staticflickr.com/${e.server}/${e.id}_${e.secret}.${e.originalformat || 'jpg'}`;
                    return {
                        title: e.time,
                        url: e.url_k || e.url_h || e.url_b || urlsetup
                    }
                });
                chrome.storage.local.set({
                    cacheImgUrls: {
                        links: photoList,
                        cachedate: Date.now()
                    }
                });
                setBackgroudImage(photoList);
            }
        });

        function setBackgroudImage(photoList) {
            let index = ((new Date()).getUTCDate() % photoList.length);
            document.body.style.backgroundImage = `url('${photoList[index].url}')`
        }
    });

})();