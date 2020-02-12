const express = require('express');
const cors = require('cors'); // Cross Origin Resource Sharing : 한 도메인에서 로드되어 다른 도메인에 있는 리소스와 상호 작용하는 클라이언트 웹 앱에 대한 벙법을 정의한다.
const passport = require('passport'); //로그인 관리
const session = require('express-session'); //session = 쿠키를 기본으로 해서 기능을 확장한 것
const cookie = require('cookie-parser');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const dotenv = require('dotenv');

const prod = process.env.NODE_ENV === 'production';
const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');

const app = express();

dotenv.config();
db.sequelize.sync( {force : false} ); 
passportConfig();

if (prod) {
    app.use(helmet());
    app.use(hpp()); //node server에 거의 필수적인 보안 모듈 (무조건 사용한다고 생각하면 됨)
    app.use(morgan('combined')); // combined : 더 자세한 로그를 볼 수 있음
    app.use(cors({
        origin : 'http://18.217.224.185',
        credentials : true,
    }));
} else {
    app.use(morgan('dev')); // 요청을 console창에 보여주는 미들웨어
    app.use(cors({
        origin : 'http://localhost:3080',
        credentials : true, //프론트와 백엔드 사이에 쿠키를 주고 받을 수 있도록
    }));
}
// app.use(cors()); -> 모든 요청을 허용
// app.use(cors('http://localhost:3000'));

app.use('/', express.static('uploads')); //front에서 uploads 폴더에 접근할 수 있다. '/' = 프론트에서 접근할 주소(가상의 주소, 보안)
app.use(express.json()); //express에서 json데이터를 요청 받기 위함
app.use(express.urlencoded({extended: false})); //form을 통해서 넘어온 데이터를 받을 때 사용
app.use(cookie('process.env.COOKIE_SECRET'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'process.env.COOKIE_SECRET', //암호화를 해제할 수 있는 비번(키)
    cookie : {
        httpOnly : true,
        secure : false,
        domain: prod && '.18.217.224.185'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res)=>{
    res.status(200).send('hello backend');
});
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

app.listen(prod ? process.env.PORT : 3085, ()=>{
    console.log(`백엔드 서버 ${prod ? process.env.PORT : 3085}번 포트에서 작동 중`)
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