module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { 
        // 모델명은 대문자로 시작하고 단수형으로 많이 씀 : Post
        // 테이블명은 소문자로 시작하고 복수형으로 많이 씀 : posts
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        }, // createdAt, updatedAt 은 자동 생성
    }, {
        charset : 'utf8mb4', // 이모티콘을 허용하려면 mb4를 붙여줘야함
        collate : 'utf8mb4_general_ci',
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); //UserId 자동 추가
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, {through : 'PostHashtag'});
        // 관계 설정을 하면 add(추가), get(조회), set(수정), remove(제거) 메서드가 생김
        // ex) addImage, removeComment ... 
    };
    return Post;
}