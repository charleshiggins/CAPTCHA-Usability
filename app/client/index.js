var textResponses = []
var imageResponses = []
var participantID
var types = ['bed', 'bread', 'building', 'dog', 'fish', 'television', 'traffic light', 'tree', 'vehicle', 'window']
var state = 'setup'
var timers = []
var imageTimers = []
var imageIndexes = [1, 2, 3, 4, 5, 6] //might not be needed if i just change the filenames

document.addEventListener("DOMContentLoaded", function (event) {
    init()
})

function init() {
    const startButton = document.getElementById("startButton")
    startButton.addEventListener("click", proceed, false)
}

function proceed(event) {
    event.preventDefault()
    participantID = document.getElementById('participantID').value
    document.getElementById("status").innerHTML = ''
    dataForInit = {
        id: participantID
    }
    fetch('/init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForInit)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    initTextChallenge()
}

function initTextChallenge() {
    state = 'text'
    renderTextCaptcha(textChallenges[0])
    pushToStatusDisplay('<div>Challenge: ' + (textResponses.length + 1) + '/10</div>')
    timers.push([Date.now()])
}
function getInputValue() {
    return document.getElementById('responseField').value
}

function handleNext(event) {
    event.preventDefault()
    if (state == 'text') {
        recordTextResponse(event)
    }
    else if (state == 'image') {
        recordImageResponse(event)

    }
    else if (state == 'finished') {
        finishedState(event)
    }
}


function recordTextResponse(event) {
    event.preventDefault()
    timers[textResponses.length].push(Date.now())
    if (textResponses.length < 9) {
        textResponses.push(getInputValue())
        renderTextCaptcha(textChallenges[textResponses.length])
        pushToStatusDisplay('<div>Challenge: ' + (textResponses.length + 1) + '/10</div>')
        timers.push([Date.now()])
        console.log(timers)

    }
    else if (textResponses.length == 9) {
        textResponses.push(getInputValue())
        pushToStatusDisplay('Click continue to move on to part 2')
        pushToChallengeDisplay('')
        imageCaptchas()
        console.log(timers)
    }
    else {
    }
}


function writeToServer() {
    dataObj = {
        id: participantID,
        text: [],
        image: [],
    }
    for (let i = 0; i < textResponses.length; i++) {
        let diff = timers[i][1] - timers[i][0]
        dataObj.text.push(
            {
                text: textResponses[i],
                time: diff
            }
        )
    }
    for (let i = 0; i < imageResponses.length; i++) {
        let diff = imageTimers[i][1] - imageTimers[i][0]
        dataObj.image.push(
            {
                image: imageResponses[i],
                time: diff
            }
        )
    }

    fetch('/submitData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}


function pushToChallengeDisplay(challengeValue) {
    var captchaArea = document.getElementById('captchaArea')
    captchaArea.innerHTML = challengeValue

}

function pushToStatusDisplay(statusValue) {
    var status = document.getElementById('status')
    status.innerHTML = statusValue
}


//todo: change to actual filename
function renderTextCaptcha(file) {
    var captchaArea = document.getElementById('captchaArea')
    captchaArea.innerHTML = '<div class="card" style="width: 18rem;"><img class="card-img-top" src="textCaptcha/' + file +
        '.png"><div class="card-body" id = "userInput"><p class="card-text"><input id = "responseField"><small class="form-text text-muted">Type the characters in the image above</small></p></div><button class="btn btn-outline-primary" id = "submitTextResponse" >Submit</button></div></div>'
    var nextButton = document.getElementById('submitTextResponse')
    nextButton.addEventListener("click", handleNext, false)

}






//todo
function renderImageCaptcha(type) {
    let instructionHTML = '<div id = "content"><div id="instructions">Select all images that contain: <span id = "theType">' + type + '</span></div>'
    let tableHTML = '<table style = "width:100%" ><tr>'
    captchaHTMLRow1 = ''
    for (i = 0; i < 3; i++) {
        captchaHTMLRow1 += '<td><div id = ' + i + '><img src="imageCaptcha/components/' + type + '/' + imageIndexes[i] + '.jpg" height="300"></div></td>'

    }
    captchaHTMLRow1 += '</tr><tr>'
    captchaHTMLRow2 = ''
    for (j = 3; j < 6; j++) {
        captchaHTMLRow2 += '<td><div id =' + j + '><img src="imageCaptcha/components/' + type + '/' + imageIndexes[j] + '.jpg" height="300"></div></td>'

    }
    captchaHTMLRow2 += ' </tr></table></div><br><br>'
    let buttonHtml = '<button class="btn btn-outline-primary" id = "submitTextResponse" >Submit</button>'
    let htmlString = instructionHTML + tableHTML + captchaHTMLRow1 + captchaHTMLRow2 + buttonHtml
    captchaArea.innerHTML = htmlString
    var nextButton = document.getElementById('submitTextResponse')

    nextButton.addEventListener("click", handleNext, false)
    for (i = 0; i < 6; i++) {
        document.getElementById(i).addEventListener("mouseenter", function () {
            hoverChoice(this.id)
        }, false)
        document.getElementById(i).addEventListener("mouseleave", function () {
            leaveChoice(this.id)
        }, false)
        document.getElementById(i).addEventListener("click", function () {
            selectChoice(this.id)
        }, false)

    }

}


function hoverChoice(id) {
    if (!document.getElementById(id).classList.contains("selected")) {
        document.getElementById(id).classList.add("hovered")
    }
}
function leaveChoice(id) {
    if (!document.getElementById(id).classList.contains("selected")) {
        document.getElementById(id).classList.remove("hovered")
    }
}
function selectChoice(id) {
    document.getElementById(id).classList.remove("hovered")
    if (!document.getElementById(id).classList.contains("selected")) {
        document.getElementById(id).classList.add("selected")

    }
    else {
        document.getElementById(id).classList.remove("selected")
        document.getElementById(id).classList.add("hovered")

    }

}

function imageCaptchas() {
    state = 'image'
    pushToStatusDisplay('')
    renderImageCaptcha(types[0])
    imageTimers.push([Date.now()])

}

function recordImageResponse(event) {
    console.log(imageResponses)
    imageTimers[imageResponses.length].push(Date.now())

    if (imageResponses.length < 9) {
        imageTimers.push([Date.now()])


        var selectedElements = document.getElementsByClassName('selected');
        temparr = []
        for (let i = 0; i < selectedElements.length; i++) {
            temparr.push(selectedElements[i].id)
        }
        imageResponses.push(temparr)
        renderImageCaptcha(types[imageResponses.length])
    }
    else if (imageResponses.length == 9) {
        var selectedElements = document.getElementsByClassName('selected');
        temparr = []
        for (let i = 0; i < selectedElements.length; i++) {
            temparr.push(selectedElements[i].id)
        }
        imageResponses.push(temparr)
        writeToServer()
        state = 'finished'
    }
    else {
    }
}

function finishedState(event) {
    captchaArea.innerHTML = '' //todo
    pushToStatusDisplay('Thank you for your participation!')
}