const passport = require("passport");
const local = require("passport-local");
const jwt = require("passport-jwt")
const { UserService } = require("../repositories");
const { createHash, isValidPassword } = require("../utils/hashedPassword");
const { COOKIE_SECRET, JWT_SECRET } = require("./config");

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const extractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
  let token = null

  if ( req && req.session) {
    console.log({coo: req.session})
    
    token = req.session.user
  }

  return token
}

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { name, age, lastName } = req.body;

          const userService = await UserService();
          const userExist = await userService.getUserByEmail(username);

          if (userExist) {
            return done(null, false);
          }

          const newUser = {
            name,
            lastName,
            email: username,
            age,
            password: createHash(password),
          };

          const user = await userService.createUser(newUser);

          return done(null, user);
        } catch (error) {
          return done("Error al obtener el usuario :" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const userService = await UserService();
    const user = await userService.getUserById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const userService = await UserService();
          const user = await userService.getUserByEmail(username);

          if (!user) {
            console.log("user does not exist");
            return done(null, false);
          }

          if (!isValidPassword(user.password, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use('jwt' ,
  new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET
  }, async(jwtPayload, done) => {
    try {
      return done(null, jwtPayload.user)
    } catch (error) {
      return done(error)
    }

  })
  )
};

module.exports = initializePassport;
