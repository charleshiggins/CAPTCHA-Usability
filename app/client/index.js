var textResponses = []
var textQ = []
var imageQ = []
var imageResponses = []
var participantID
var types = ['bed', 'bread', 'building', 'dog', 'fish', 'television', 'traffic light', 'tree', 'vehicle', 'window']
var state = 'setup'
var timers = []
var imageTimers = []
var imageIndexes = [1, 2, 3, 4, 5, 6] //might not be needed if i just change the filenames
var textChallenges = ['2QjXK', '9FkS7', 'C0nGZ', 'fzODD', 'LdKhL', 'U1M6C', 'uYCVd', 'W8xVh', 'wxcio', 'zDLMF']

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
    else if (state == 'textQuestionnaire') {
        recordTextQuestionnaireResponse()
    }
    else if (state == 'image') {
        console.log(event, 'here it is')
        recordImageResponse(event)

    }
    else if (state == 'imageQuestionnaire') {
        recordImageQuestionnaireResponse()
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
        // pushToStatusDisplay('Click continue to move on to part 2')
        state = "textQuestionnaire"
        pushToChallengeDisplay(postTextQuestionnaire())
        var submitTQ = document.getElementById('submitTextQuestionnaire')
        submitTQ.addEventListener("click", handleNext, false)

        //  imageCaptchas()
    }
    else {
    }
}

function recordTextQuestionnaireResponse() {
    textQ.push(document.querySelector("input[name='textQ1']:checked").id)
    textQ.push(document.querySelector("input[name='textQ2']:checked").id)
    textQ.push(document.querySelector("input[name='textQ3']:checked").id)
    imageCaptchas()
}

function recordImageQuestionnaireResponse() {
    imageQ.push(document.querySelector("input[name='imageQ1']:checked").id)
    imageQ.push(document.querySelector("input[name='imageQ2']:checked").id)
    imageQ.push(document.querySelector("input[name='imageQ3']:checked").id)
    writeToServer()
    state = 'finished'
    finishedState()

}


//need to consolidate these two enormous functions
function postTextQuestionnaire() {
    return 'Would you describe the CAPTCHA challenges you just completed as: <br> Easy?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree1" name="textQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree1">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree1" name="textQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree1">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral1" name="textQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral1">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree1" name="textQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree1">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree1" name="textQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree1">Strongly Agree </label>' +
        '</div>' +
        '<br><br>Frustrating?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree2" name="textQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree2">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree2" name="textQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree2">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral2" name="textQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral2">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree2" name="textQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree2">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree2" name="textQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree2">Strongly Agree </label>' +
        '</div>' +
        '<br><br>Enjoyable?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree3" name="textQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree3">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree3" name="textQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree3">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral3" name="textQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral3">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree3" name="textQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree3">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree3" name="textQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree3">Strongly Agree </label>' +
        '</div>' +
        '<div><button class="btn btn-outline-primary" id = "submitTextQuestionnaire" >Submit</button></div>'
}

function postImageQuestionnaire() {
    return 'Would you describe the CAPTCHA challenges you just completed as: <br> Easy?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree1" name="imageQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree1">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree1" name="imageQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree1">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral1" name="imageQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral1">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree1" name="imageQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree1">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree1" name="imageQ1" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree1">Strongly Agree </label>' +
        '</div>' +
        '<br><br>Frustrating?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree2" name="imageQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree2">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree2" name="imageQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree2">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral2" name="imageQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral2">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree2" name="imageQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree2">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree2" name="imageQ2" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree2">Strongly Agree </label>' +
        '</div>' +
        '<br><br>Enjoyable?   <br> ' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyDisagree3" name="imageQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyDisagree3">Strongly Disagree</label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="disagree3" name="imageQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="disagree3">Disagree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="neutral3" name="imageQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="neutral3">Neutral </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="agree3" name="imageQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="agree3">Agree </label>' +
        '</div>' +
        '<div class="custom-control custom-radio custom-control-inline">' +
        '<input type="radio" id="stronglyAgree3" name="imageQ3" class="custom-control-input">' +
        '<label class="custom-control-label" for="stronglyAgree3">Strongly Agree </label>' +
        '</div>' +
        '<div><button class="btn btn-outline-primary" id = "submitImageQuestionnaire" >Submit</button></div>'
}
function writeToServer() {
    dataObj = {
        id: participantID,
        text: [],
        textQuestionnaire: textQ,
        image: [],
        imageQuestionnaire: imageQ,
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
        state = 'imageQuestionnaire'
        pushToChallengeDisplay(postImageQuestionnaire())
        var submitIQ = document.getElementById('submitImageQuestionnaire')
        submitIQ.addEventListener("click", handleNext, false)
    }
    else {
    }
}

function finishedState(event) {
    captchaArea.innerHTML = '' //todo
    pushToStatusDisplay('Thank you for your participation!')
}