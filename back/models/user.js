module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( 'User', {
        email : {
            type: DataTypes.STRING(40),
            allowNull : false, //필수 입력 사항
        },
        nickname : {
            type: DataTypes.STRING(20),
            allowNull : false,
        },
        password : {
            type: DataTypes.STRING(100),
            allowNull : false,
        }
    },
    {
        charset: 'utf8',
        charset: 'utf8_general_ci', //한글 사용을 위함
    });
    User.associate = (db) => {

    };
    return User;
}