exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
        // next() 의 의미는 다음 미들웨어로 넘아가는 것.
        // next() 안에 매개변수가 있다면 에러처리로 넘어감.
    }
    return res.status(401).send('로그인이 필요합니다.');
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        return next();
    }
    return res.status(401).send('로그인한 사람은 이용할 수 없습니다.');
};

/*ㅊ
    module.exports = 대표적인 기능을 하는 것을 export하는 것.
    exports.(something) = 대표적인 기능이 딱히 없이 일반적인 것들을 export할 때.
*/