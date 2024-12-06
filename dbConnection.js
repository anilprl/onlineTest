import { Sequelize, DataTypes } from "sequelize";
import config from 'config';

const sequelize = new Sequelize(config.get('db.database'), config.get('db.userName'), config.get('db.password'),
{
    host : config.get('db.dbHost'),
    port: config.get('db.dbPort'),
    dialect: config.get('db.dialect')
});

sequelize.authenticate().then( () => {
    console.log('connected to database');
})
.catch( (err) => {
    console.log('ERROR: ', err);
})

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;