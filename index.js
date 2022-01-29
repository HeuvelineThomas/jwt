const express = require('express')
const app = express()

require('dotenv').config();
const bcrypt = require('bcrypt')

const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')
const sequelize = require('./utils/database')
const UserModel = require('./models/user')
const User = sequelize.models.user

app.use(bodyParser.json())
app.use(cookieParser())

const port = 3000

try {
    sequelize.authenticate();
    console.log('Connecté à la base de données MySQL!');
} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

app.listen(port, () => {
    console.log("L'application écoute sur le port" + port)
})

// Creating all the tables defined in user
sequelize.sync()

app.get("/me", (req, res) => {
    const token = req.cookies.access_token;
    if(!token) {
        res.status(401).send("Aucune utilisateur de connecté")
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err ,decoded) => {
            res.status(200).send(decoded);
        });
    }
})

app.post('/session', (req, res) => {
    let data = req.body
    if(data.constructor === Object && Object.keys(data).length === 0){
        res.status(204)
    } else {
        User.findOne({
            where: {
                userName : data.userName
            }
        }).then((user) => {
            if(user) {
                console.log("200")  
                const saltRounds = 6
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    //hashage du password
                    bcrypt.hash(data.password, salt, function(err, hash) {
                        //update de l'utilisateur dans la base de données
                        user.update({
                            salt: salt,
                            hash: hash,
                            updatedAt: new Date()
                        })
                    });
                });

                const token = jwt.sign({ userName : data.userName}, process.env.ACCESS_TOKEN_SECRET)
                // .header('Authorization', 'Bearer ' + token)
                res.cookie("access_token", token, {
                    httpOnly: true,
                })
                res.status(201)
                res.json({
                    token,
                });    
            } else {
                res.status(404).json({error : "L'utilisateur n'existe pas"})
            }
        });
    }
});

app.delete("/session", (req, res) => {
    const token = req.cookies.access_token;
    if(!token) {
        res.status(401).send("Aucune session")
    } else {
        res.clearCookie("access_token")
        res.status(204)
        res.json({message : "Vous êtes déconnecté"})
        console.log("cookie effacé")
    }
})



