



console.log("test")




document.addEventListener("DOMContentLoaded", function (event) {
    function start(){
        console.log("okokokokokok")
    }

    const startButton = document.getElementById("startButton")
    startButton.addEventListener("click", start, false)
    console.log(startButton)




    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let types = ['bed', 'bread', 'building', 'dog', 'fish', 'television', 'traffic light', 'tree', 'vehicle', 'window']
    for (n = 0; n < types.length; n++) {


        let imageIndexes = [1, 2, 3, 4, 5, 6]
        shuffleArray(imageIndexes)
        let instructionHTML = '<div id = "content"><div id="instructions">Select all images that contain: <span id = "theType">' + types[n] + '</span></div>'
        let tableHTML = '<table style = "width:100%" ><tr>'
        captchaHTMLRow1 = ''
        for (i = 0; i < 3; i++) {
            captchaHTMLRow1 += '<td><div><img src="imageCaptcha/components/' + types[n] + '/' + imageIndexes[i] + '.jpg" height="300"></div></td>'
        }
        captchaHTMLRow1 += '</tr><tr>'
        captchaHTMLRow2 = ''
        for (j = 3; j < 6; j++) {
            captchaHTMLRow2 += '<td><div><img src="imageCaptcha/components/' + types[n] + '/' + imageIndexes[j] + '.jpg" height="300"></div></td>'
        }
        captchaHTMLRow2 += ' </tr></table></div><br><br>'

        document.body.innerHTML += instructionHTML + tableHTML + captchaHTMLRow1 + captchaHTMLRow2
    }
})
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array