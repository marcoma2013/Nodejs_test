let Users = require('./users');
let express = require('express');
let app = express();
let router = express.Router();
let jwt = require('jsonwebtoken');
let path = require('path');
let fs = require('fs');
let Token = require('./token');
const secret = 'secret string';
let requestCount = 1;

// dev or prod, replace the url
let env = process.argv[2];
const devUrl = 'http://192.168.218.129:3000';
const prodUrl = 'http://marcoma2013.oicp.io:38968';
if (!env) {
    console.log('Please Enter dev Or prod and Try again!');
    return;
} else {
    let replacedUrl;
    if (env.includes('dev')) {
        replacedUrl = devUrl;
    } else {
        replacedUrl = prodUrl;
    }
    fs.readdir(path.join(__dirname, '/public'), (error, files) => {
        if (error) {
            return console.error(error);
        }
        files.forEach((file) => {
            if (file.endsWith('.js')) {
                replaceFileContent(path.join(__dirname + '/public', file), 'localhost', replacedUrl)
            }
        });
    })
}

app.use(express.urlencoded());
app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));

//allow custom header and CORS
app.use(function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

router.get('/', (req, res) => {
    console.log(req.ip + " requested!!!");
    res.redirect('/login.html');
})

router.post('/login', (req, res) => {
    console.log('Request ---- ' + requestCount++);
    if (Users.find(user => user.id === +req.body.id && user.password === req.body.password)) {
        const token = Token.encrypt({
            id: req.body.id,
            password: req.body.password
        }, 60 * 60);
        res.status(200).json({
            token: token
        });
    } else {
        res.status(200).json({
            message: 'id or password is wrong!'
        });
    }
});

router.get('/userInfo', (req, res) => {
    let data = Token.decrypt(req.headers.authorization.split(' ')[1]);
    res.status(200).json(data);
    // res.send('Current user id: '+data.id);
})

let server = app.listen(3000, () => {
    console.log(server.address().address);
})

let replaceFileContent = (file, originContent, replacedContent) => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let result = content.replace(originContent, replacedContent);

        try {
            fs.writeFileSync(file, result, 'utf8');
            console.log(`Replced content for ${file} successed!`);
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log('Errors occured when replacing file content!!!')
    }
};