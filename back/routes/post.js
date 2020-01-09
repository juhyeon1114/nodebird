const express = require('express');
const multer = require('multer'); // form data 해석을 위함
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads'); // uploads라는 경로에 업로드
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            // example.png -> basename = example, ext = .png
            done(null, basename + Date.now() + ext);
        }
    }),
    limit : {fileSize: 20 * 1024 * 1024}, //20 MB (20byte * 1024 * 1024)
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    // upload.single() -> 파일 하나
    // upload.array(키 값) -> 같은 키로 여러 개
    // upload.fields(키 값들) -> 다른 키로 여러 개
    // upload.none() -> 파일 업로드 x
    // console.log(req.files);
    res.json(req.files.map(v => v.filename));
});

router.post('/', isLoggedIn, async (req, res) => {
    try {
        // req.body.content,
        // req.body.imagePaths,
        const hashtags = req.body.content.match(/#[^\s]+/g); // 해쉬태그 정규 표현식 : # 뒤에 공백이 아닌 문자
        const newPost = await db.Post.create({
            content : req.body.content,
            UserId : req.user.id,
        });
        if(hashtags){
            const result = await Promise.all (hashtags.map(tag => db.Hashtag.findOrCreate({
                where : { name : tag.slice(1).toLowerCase() }    
            })));
            await newPost.addHashtags(result.map(r => r[0])); // addHashtags() 메서드는 sequelize가 자동으로 만든 것
            // 복잡한 쿼리를 sequelize로 수행하는 경우 오류가 생길수도 있다. 그럴 경우엔 직접 쿼리를 날린다.
            // -> db.sequelize.query('sql문')   
        }
        const fullPost = await db.Post.findOne({
            where : { id : newPost.id },
            include : [{
                model : db.User, // db.Post를 포스팅한 사용자의 id를 토대로 User에서 정보들을 가져온다.
                attributes : ['id', 'nickname'], // 모든 정보가 아닌 id와 nickname만을 가져온다.
            }],
        });
        return res.json(fullPost);
    } catch (err){
        console.err(err);
        next(err);
    }
});

module.exports = router;