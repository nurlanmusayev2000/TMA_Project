const jwt = require('jsonwebtoken');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Mn1475369',
        database: 'ecommerce',
        port: 5432
    }
});
const secretKey = 'mySecretKey';

async function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader.split(' ')[1];
    let refreshT = req.headers.refreshtoken

    if (token != 'null') {

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {

                if (refreshT == null) {
                    return res.status(403).json({ message: 'Token verification failed' });
                }
                console.log(refreshT);
                // Attempt to refresh the access token using the refresh token
                jwt.verify(refreshT, secretKey, (err, user) => {
                    if (err) {
                        return res.status(403).json({ message: 'Refresh token verification failed' });
                    }

                    // Generate a new access token
                    const newAccessToken = jwt.sign({ id: user.id, username: user.username }, secretKey, {
                        expiresIn: '1h', // New access token expires in 1 hour
                    });
                    req.newtoken = newAccessToken;
                    // Attach the user information to the request
                    req.user = user;
                    return next();
                });
            } else {
                req.user = user;
                next();
            }
        });

    } else {
        res.status(401).json({ message: 'no authorization headers found' })
    }
};