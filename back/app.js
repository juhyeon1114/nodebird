const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./models');
const app = express();
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

db.sequelize.sync( {force : false} ); 
passportConfig();

app.use(morgan('dev')); // 요청을 console창에 보여주는 미들웨어
// app.use(cors()); -> 모든 요청을 허용
app.use(cors('http://localhost:3000'));
app.use(express.json()); //express에서 json데이터를 요청 받기 위함
app.use(express.urlencoded({extended: false})); //form을 통해서 넘어온 데이터를 받을 때 사용
app.use(cookie('cookiesecret'));
app.use(session());
app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret', //암호화를 해제할 수 있는 비번(키)
}));

app.get('/',(req, res)=>{
    res.status(200).send('hello backend');
});

app.post('/user', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = db.User.findOne({
            where : {
                email : req.body.email,
            }
        });
        if(exUser){
            return res.status(403).json({
                errorCode : 1,
                message : '이미 회원가입되어있습니다',
            });
        }
        const newUser = await db.User.create({
            email : req.body.email,
            password : hash,
            nickname : req.body.nickname,
        });
        return res.status(200).json(newUser);
    } catch(err) {
        console.log(err);
        return next(err);
    }
});

app.post('/user/login', (req, res, next) => {
    // req.body.email, req.body.password 가 넘어옴
    passport.authenticate('local', (err, user, info) => { // localStrategy 실행
        if(err){
            console.log(err);
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (err)=>{
            // req.login() = 세션에 사용자 정보 저장, 프론트에 cookie내려보내줌, body에 사용자 정보 내려보내주는 함수
            if(err){
                console.error(err);
                return next(err);
            }
            return res.json(user);
        }); 
    })(req, res, next);
});

app.listen(3085, ()=>{
    console.log(`백엔드 서버 ${3085}번 포트에서 작동 중`)
});


/*
    [암호화방법]
    1. bcrypt
        -> 윈도우 os 인 경우
        -> npm install --global --production windows-build-tools
        -> npm i bcrypt
    2. scrypt
    3. pbkdf2
*/