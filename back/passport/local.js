const passport = require('passport');
const bycrypt = require('bcrypt');
const db = require('../models');
const { Strategy : LocalStrategy } = require('passport-local');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'email', // 넘어온 req.body.email
        passwordField : 'password', // 넘어온 req.body.password
    }, async (email, password, done) => {
        // 이하 : login 가능한지 판단
        try {
            const exUser = await db.User.findOne({ where : { email : req.body.email } });
            if(!exUser){
                return done(null, false, {reason : '존재하지 않는 사용자입니다.'});
                // done(에러, 성공, 실패);
            }
            const result = await bycrypt.compare(password, exUser.password);
            if(result){
                return done(null, exUser);
            } else {
                return done(null, false, {reason : '비밀번호가 틀립니다.'});
            }
        } catch (err) {
            console.log(err);
            return done(err)
        }
        
    }));
}