import Knex from 'knex';
import config from '../config.json';

const {
    host, port, database, user, password,
} = config.database.mysql;

export default Knex({
    client: 'mysql',
    connection: {
        host,
        port,
        database,
        user,
        password,
    },
});
