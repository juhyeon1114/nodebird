module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        }, 
    }, {
        charset : 'utf8mb4', // 이모티콘을 허용하려면 mb4를 붙여줘야함
        collate : 'utf8mb4_general_ci',
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}