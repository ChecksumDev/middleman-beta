import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    dialect: `sqlite`,
    storage: '../data/database.sqlite',
    logging: false,
});

const Images = sequelize.define('images', {
    url: {
        type: DataTypes.TEXT,
        unique: true,
    },
    rating: DataTypes.TEXT,
    user: DataTypes.TEXT,
});

const Users = sequelize.define('users', {
    userid: {
        type: DataTypes.TEXT,
    },
    count: DataTypes.INTEGER,
});

const Apikeys = sequelize.define('apikeys', {
    key: {
        type: DataTypes.TEXT,
        unique: true,
    },
    user: {
        type: DataTypes.TEXT,
        unique: true,
    },
});

export { sequelize, Images, Users, Apikeys };