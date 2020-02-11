const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                }
            }
        }
        const posts = await db.Post.findAll({
            where,
            include : [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) }, //한글사용을 위한 decode...
            }, {
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
            //offset: parseInt(req.query.offset, 10), // 시작 부분
            limit: parseInt(req.query.limit, 10) // 끝 부분
            // 실무에선 offset, limit을 잘 안씀
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;