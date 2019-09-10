const mysql = require('mysql');
const bcrypt = require('bcryptjs');

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
            this.connection.query('SELECT * FROM `things` WHERE `isPublic` = 0', function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });
        })
    }

    updateThing(thing, id){
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE `things` SET `thing`=? WHERE `id`=?',[thing, id], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result.affectedRows);
            });
        })
    }

    addUser(name, pass) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `users`(`name`, `pass`) VALUES (?, ?)', [name, pass], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result.insertId);
            });
        })
    }

    getUserByName(name) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `users` WHERE `name`=?', [name], function (error, result) {
                if (error) {
                    return reject(error);
                }

                resolve(result[0]);
            });
        })
    }

    async checkUser(userName, password) {
        const user = await this.getUserByName(userName);

        if (!user) {
            return null;
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.pass.toString(), function (err, res) {
                if (err) {
                    return reject(err);
                }

                if (res) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
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
                resolve(result.length === 0 ? null : result[0]);
            });
        })
    }

    addThingUser(thing, userid, isPublic) {
        return new Promise((resolve, reject) => {
            if (isPublic === undefined){
                this.connection.query('INSERT INTO `things`(`thing`, `userid`, `isPublic`) VALUES (?, ?, 0)', [thing, userid, isPublic], function (error, result) {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                });

                return;
            }
            this.connection.query('INSERT INTO `things`(`thing`, `userid`, `isPublic`) VALUES (?, ?, ?)', [thing, userid, isPublic], function (error, result) {
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

    getThing(id){
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT*FROM `things` WHERE `id` = ?',[id], function (error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(result.length === 0 ? null : result[0]);
            });
        })
    }


}

module.exports = DataBase;