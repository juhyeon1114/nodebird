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
            // example.png -> basename = example, ext = .pngf
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
        if(req.body.image){
            if(Array.isArray(req.body.image)){ 
            // express 에서 image를 받을 때, 이미지가 1개인 경우 배열에 담기도하고 안담기도 함. 그에 따른 처리
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }))
            } else {
                await db.Image.create({ src: req.body.image, PostId: newPost.id });
            }
        }
        const fullPost = await db.Post.findOne({
            where : { id : newPost.id },
            include : [{
                model : db.User, // db.Post를 포스팅한 사용자의 id를 토대로 User에서 정보들을 가져온다.
                attributes : ['id', 'nickname'], // 모든 정보가 아닌 id와 nickname만을 가져온다.
            }, {
                model: db.Image, //게시글에 포함된 이미지도 같이 묶어줌
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        return res.json(fullPost);
    } catch (err){
        console.err(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await db.Post.destroy({
            where: {
                id: req.params.id,
            }
        });
        res.send('삭제했습니다');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({where : {id : req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        const comments = await db.comment.findAll({
            where: {
                PostId: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
            order : [['createdAt','ASC'],], //2차원배열로 하는 이유는 두번째 조건이 있을 수도 있어서
        });
        res.json(comments);
    } catch(err) {
        console.err(err);
        next(err);
    }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { 
    // /post/:id/comment -> :id = 동적으로 바뀔 수 있는 부분에 콜론을 붙여준다.
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post){ // 존재하는 게시글인지 판단
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({ // 존재하는 게시글이라면 댓글 만들어줌
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        const comment = await db.Comment.findOne({
            where : {
                id: newComment.id,
            },
            include : [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }]
        });
        return res.json(comment);
    } catch (err) {
        console.error(err);
        next(err); 
    }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet', //리트윗한 게시글이면 원본 게시글이 됨
            }],
        });
        if (!post) {
            return res.status(404).send("포스트가 존재하지 않습니다.");
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            // 내 게시글을 리트윗하는 경우
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            }
        })
        
        if (exPost) {
            return res.status(403).send('이미 리트윗했습니다.')
        }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId, //원본 아이디
            content: 'retweet',
        });
        const retweetWithPrevPost = await db.Post.findOne({
            where: {id: retweet.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname']
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname']
                }, {
                    model: db.Image,
                }],
            }],
        });
        // include문 안에 include문을 사용하는 것은 비추
        res.json(retweetWithPrevPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.paramss.id }});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        res.json({userId: req.user.id});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        res.json({userId: req.user.id});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; 