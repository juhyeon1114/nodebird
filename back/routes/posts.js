const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts?offset=10&limit=10
    try {
        const posts = await db.Post.findAll({
            include : [{
                model: db.User,
                attributes:['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as : 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }]
            }],
            order: [['createdAt', 'DESC']],
            offset: parseInt(req.query.offset, 10), // 시작 부분
            limit: parseInt(req.query.limit, 10) // 끝 부분
            // 실무에선 offset, limit을 잘 안씀
        });
        res.json(posts);
    } catch (err) {
        console.err(err);
        next(err);
    }
});


module.exports = router;