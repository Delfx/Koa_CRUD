const mysql = require('mysql');

class DataBase {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'addlist'
        });

        this.connection.on('error', function (error) {
            console.log(error);
        });

        this.connection.connect();
    }

    getThings() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT*FROM `things` ', function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    getThingsById(userid) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT*FROM `things` WHERE `userid` = ?',[userid], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    addThing(thing) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `things`(`thing`) VALUES (?)', [thing], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    addThingUser(thing, userid) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `things`(`thing`, `userid`) VALUES (?, ?)', [thing, userid], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    getUser(name){
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT*FROM `users` WHERE `name` = ?',[name], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    getUserById(id){
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT*FROM `users` WHERE `id` = ?',[id], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    deleteById(id){
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `things` WHERE `id` = ?',[id], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

}

module.exports = DataBase;