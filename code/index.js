// This is the main app file, it launches the server and starts the mongoDB connection.
const express = require('express');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cookieSession = require('cookie-session');

const constants = require('./constants');
const apiRoutes = require('./api-routes');


function setupAuthorization(app) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new GoogleStrategy(
        {
            clientID: constants.CLIENT_ID,
            clientSecret: constants.CLIENT_SECRET,
            callbackURL: constants.CALLBACK_URL
        },
        function (accessToken, refreshToken, profile, done) {
            console.log('Should do the login DB check here');
            return done(null, profile);
        }
    ));

    app.use(cookieSession({
        name: 'google-auth-session',
        keys: [constants.COOKIE_KEY1, constants.COOKIE_KEY2]
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth',
        passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/redirect', passport.authenticate('google', { failureRedirect: '/login.html' }),
        function (req, res) {
            res.redirect('/');
        }
    );
    app.get('/auth/logout', (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/login.html');
    });
}

function launchServer() {
    const app = express();
    setupAuthorization(app);
    const isLoggedIn = (req, res, next) => {
        var route = req.headers.referer ? req.headers.referer : req.path;
        if (req.user || route.includes('/login.html')) {
            next();
        } else {
            res.redirect('/login.html');
        }
    };
    app.use([isLoggedIn, express.static('public')]);
    app.use(function (_req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/api', apiRoutes);

    //Definig the port in which will run our app
    if (constants.CERTS_AVAILABLE) {
        // We have the certificates, open https
        const credentials = {
            key: constants.PRIV_KEY,
            cert: constants.CERT,
            ca: constants.CHAIN
        };

        const httpServer = http.createServer(app);
        const httpsServer = https.createServer(credentials, app);

        //also open http on other port
        httpServer.listen(constants.PORT2, () => {
            console.log('HTTP Server running on port ' + constants.PORT2);
        });

        httpsServer.listen(constants.PORT2, () => {
            console.log('HTTPS Server running on port ' + constants.PORT1);
        });
    }
    else {
        //we dont have the certificates, open http only
        console.log('No https certificates found, opening only http');
        const httpServer = http.createServer(app);
        httpServer.listen(constants.PORT1, () => {
            console.log('HTTP Server running on port ' + constants.PORT1);
        });
    }
}

async function connectMongo() {
    const clientMongo = new MongoClient(constants.MONGO_URI, { useUnifiedTopology: true, connectTimeoutMS: constants.MONGO_TIMEOUT, serverSelectionTimeoutMS: constants.MONGO_TIMEOUT });
    try {
        await clientMongo.connect();
        const db = clientMongo.db(constants.MONGO_DBNAME);
        return db;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function main() {
    const db = await connectMongo();
    if (db) {
        console.log('Connected to DB in ' + constants.MONGO_URI + constants.MONGO_DBNAME);
    } else {
        console.log('Error connecting to DB in ' + constants.MONGO_URI + constants.MONGO_DBNAME);
    }
    launchServer();
}


main().catch(console.error);


