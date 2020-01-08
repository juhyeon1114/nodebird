const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
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
        await db.User.create({
            email : req.body.email,
            password : hash,
            nickname : req.body.nickname,
        });
        passport.authenticate('local', (err, user, info) => { // localStrategy 실행
            if(err){
                console.error(err);
                return next(err);
            }
            if(info){
                console.log(1);
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
        //return res.status(200).json(newUser);
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    // req.body.email, req.body.password 가 넘어옴
    // req.cookie 에 connect.sid(식별자) 가 넘어옴
    passport.authenticate('local', (err, user, info) => { // localStrategy 실행
        if(err){
            console.error(err);
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
            return res.json(user); //login success 
        }); 
    })(req, res, next);
});



router.post('/logout', isLoggedIn, (req, res) => { 
    if(req.isAuthenticated()){
        req.logout();
        req.session.destroy(); //(선택사항) 세션에 로그인 정보말고 다른 정보도 있을 수 있음
        return res.status(200).send('로그아웃 완료');
    }
});

module.exports = router;