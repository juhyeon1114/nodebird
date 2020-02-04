const passport = require('passport');
const local = require('./local');
const db = require('../models')

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });
    passport.deserializeUser( async (id, done) => {
        // 로그인 후, 모든 요청에 deserializeUser()가 실행됨
        try {
            const user = await db.User.findOne({
                where : {id},
                attributes: ['id', 'nickname'], //password를 제거하고 id, nickname만 가져옴
                include: [{
                    model: db.Post,
                    attributes: ['id'],
                  }, {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id'],
                  }, {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id'],
                  }],
            });
            return done(null, user); // req.user에 넣어줌, req.isAuthenticated()를 true로 만들어줌
        } catch (err){
            console.error(err);
            return done(err);
        }
        
    });
    local(); // local strategy 등록
};