const express = require('express');
const multer = require('multer'); // form data 해석을 위함
const path = require('path');

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
    console.log(req.files);
    res.json(req.files.map(v => v.filename));
});

router.post('/', isLoggedIn, (req, res) => {

});



module.exports = router;