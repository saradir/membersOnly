import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { pool }  from '../db/pool.js';
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
        try{
            const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = rows[0];
            
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            const match = await bcrypt.compare(password, user.hashed_password);
            if (!match){
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err){
            return done(err);
        }
    })
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

export default passport;