#!/usr/bin/env node

const bcrypt = require('bcrypt')
const sequelize = require('./utils/database')
const UserModel = require('./models/user')
const User = sequelize.models.user

require('yargs')
    .scriptName("pirate-parser")
    .usage('$0 <cmd> [args]')
    .command('user [username] [password]', 'Commande pour la création d\'un utilisateur : node ./createUser --username <username> --password <password>', (yargs) => {
        yargs.positional('username', {
            type: 'string',
            describe: "Le nom d'utilisation de l'utilisateur"
        }),
        yargs.positional('password', {
            type: 'string',
            describe: "Le mot de passe de l'utilisateur"
        })
    
    }, function (argv) {
        console.log('username = ', argv.username)
        console.log('password = ', argv.password)
        const saltRounds = 6
        //génération du sel
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //hashage du password
            bcrypt.hash(argv.password, salt, function(err, hash) {
                //Ajout de l'utilisateur dans la base de données
                User.create({
                    userName: argv.username,
                    salt: salt,
                    hash: hash,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            });
        });
    })
    .help()
    .argv