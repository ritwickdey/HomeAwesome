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
    const wishes = [
        [0, 4, "Good night"], 
        [5, 11, "Good morning"],   
        [12, 17, "Good afternoon"],
        [18, 24, "Good evening"]
    ];
      
    
    let timeFormatIndex = 0;

    let getWishMsg = () => {
        let hrs = (new Date()).getHours();

        for(let i = 0; i < wishes.length; i++){
            if(hrs >= wishes[i][0] && hrs <= wishes[i][1]){
                return wishes[i][2] ;
            }
        }

    }

    let getGettingMsg = () => {
        let msg = [""];
        const defaultGetting = [
            getWishMsg(),
            "Have A Great day."
        ];

        try {
            let options = JSON.parse(localStorage.getItem('options'));
            let greetingMsgs = options.greetingMsgs;
            if (greetingMsgs)
                greetingMsgs = greetingMsgs.split(',');
            else
                greetingMsgs = defaultGetting;
            let name = options.username || 'there';
            msg.push(`Hi, ${name}`, getWishMsg(), ...greetingMsgs);
        } catch (error) {
            msg.push(...defaultGetting);
        }
        finally {
            msg = msg.map(e => e + '^600');
        }

        return msg;
    };

    let options = {
        strings: getGettingMsg(),
        typeSpeed: 35,
        smartBackspace: true,

        backSpeed: 20,
        loop: true,
        loopCount: Infinity,
        showCursor: true,
        cursorChar: '|'
    }



    let typed = new Typed("#welcomeMsg", options);

    typed.complete = () => {
        typed.strings = getGettingMsg();
    }


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
            url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=0caa69f8005326b54a21b8baa2181395&user_id=152281330%40N02&extras=original_format%2C+url_k%2C+url_h%2C+url_b&per_page=10&format=json&nojsoncallback=1",
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
            let index = (((new Date()).getUTCDate()) % photoList.length);
            document.body.style.backgroundImage = `url('${photoList[index].url}')`
        }
    });

})();