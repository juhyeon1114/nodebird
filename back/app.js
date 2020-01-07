const express = require('express');
const db = require('./models');
const app = express();

db.sequelize.sync(); 

app.use(express.json()); //express에서 json데이터를 요청 받기 위함
app.use(express.urlencoded({extended: false})); //form을 통해서 넘어온 데이터를 받을 때 사용

app.get('/',(req, res)=>{
    res.status(200).send('hello backend');
});

app.post('/user', async (req, res, next)=>{
    try {
        await db.User.create({
            where : {
                email : req.body.email,
                password : req.body.password,
                nickname : req.body.nickname,
            }
        });
        res.status(200).json(newUser);
    } catch(err) {
        console.log(err);
        next(err);
    }
    
});

app.listen(3085, ()=>{
    console.log(`백엔드 서버 ${3085}번 포트에서 작동 중`)
});