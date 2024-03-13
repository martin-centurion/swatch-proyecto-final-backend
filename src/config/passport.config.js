import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../config.js';

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        return token = req.cookies.access_token;
    };
};

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.jwtSecret
};

export const init = () => {
    passport.use('jwt', new JwtStrategy(opts, (payload, done) => {
        return done (null, payload);
    }));
};
