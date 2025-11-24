import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false, { message: "Invalid credentials" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;