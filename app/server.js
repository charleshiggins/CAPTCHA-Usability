const express = require('express')
const app = express()
const fs = require('fs')
const mkdirp = require('mkdirp')

app.use('/', express.static('./client/'));
app.use(express.json())
app.listen(8080)

app.post('/submitData', function (req, res, ) {
    console.log(req.body)
    let fileName = req.body.id.toString()
    fs.writeFile('outputFiles/p' + fileName + '/output.json', JSON.stringify(req.body), (err) => {
        if (err) throw err;
    });
})

app.post('/init', function (req, res, ) {
    mkdirp('outputFiles/p' + req.body.id)
})