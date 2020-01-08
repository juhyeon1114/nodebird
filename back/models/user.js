module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( 'User', {
        email : {
            type: DataTypes.STRING(40),
            allowNull : false, //필수 입력 사항
            unique : true,
        },
        nickname : {
            type: DataTypes.STRING(20),
            allowNull : false,
        },
        password : {
            type: DataTypes.STRING(100),
            allowNull : false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글 사용을 위함
    });
    User.associate = (db) => {
        // associate -> 모델(테이블)들 간의 관계를 서술하는 부분
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
    };
    return User;
}

/*
    [모델들 간의 관계]
    1) 1:1  -> hasOne, belongsTo
    2) 1:n  -> hasMany, belongsTo
    3) n:n  -> belongsToMany
*/