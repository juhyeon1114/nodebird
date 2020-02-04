const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    const user = req.user;
    res.json(user);
});

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
                return res.status(401).send(info.reason);
            }
            return req.login(user, async (err)=>{
                // req.login() = 세션에 사용자 정보 저장, 프론트에 cookie내려보내줌, body에 사용자 정보 내려보내주는 함수
                if(err){
                    console.error(err);
                    return next(err);
                }
                const fullUser = await db.User.findOne({
                    where: {id: user.id},
                    attributes: ['id', 'email', 'nickname'],
                    include: [{
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }]
                });
                return res.json(fullUser);
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
            const fullUser = await db.User.findOne({
                where: {id: user.id},
                attributes: ['id', 'email', 'nickname'],
                include: [{
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            });
            return res.json(fullUser);
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

router.post('/:id/follow', isLoggedIn, async (req, res, next)=>{
    try {
        const me = await db.User.findeOne({
            where: {id: req.user.id},
        })
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findeOne({
            where: {id: req.user.id},
        })
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch('/nickname', isLoggedIn, async (req, res, next)=>{ //patch == 부분수정
    try {
        await db.User.update({
            nickname: req.body.nickname, // 수정할 데이터
        }, {
            where: {id:req.user.id},
        });
        res.send(req.body.nickname);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {id: req.user.id},
        });
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10),
        });
        res.json(followings);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {id: req.user.id},
        });
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10),
        });
        res.json(followers);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;