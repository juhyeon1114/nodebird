const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); //session = 쿠키를 기본으로 해서 기능을 확장한 것
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express();

db.sequelize.sync( {force : false} ); 
passportConfig();

app.use(morgan('dev')); // 요청을 console창에 보여주는 미들웨어
// app.use(cors()); -> 모든 요청을 허용
//app.use(cors('http://localhost:3000'));
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true, //프론트와 백엔드 사이에 쿠키를 주고 받을 수 있도록
}));
app.use('/', express.static('uploads')); //front에서 uploads 폴더에 접근할 수 있다. '/' = 프론트에서 접근할 주소(가상의 주소, 보안)
app.use(express.json()); //express에서 json데이터를 요청 받기 위함
app.use(express.urlencoded({extended: false})); //form을 통해서 넘어온 데이터를 받을 때 사용
app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret', //암호화를 해제할 수 있는 비번(키)
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res)=>{
    res.status(200).send('hello backend');
});
app.use('/user', userRouter);
app.use('/post', postRouter);

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