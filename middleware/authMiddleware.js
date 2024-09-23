import passport from 'passport';

export const authMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
          const error = new Error("Unauthorized");
          error.status = 401;
          return next(error);
        }
        req.user = user;
        console.log('Authenticated user:', req.user);
        next();
    })(req, res, next);
};

