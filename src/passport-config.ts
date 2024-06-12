import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "./db";
import { Request } from "express";

declare module 'express-session' {
  interface Session {
    signup?: boolean;
  }
}

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CLIENT_ID = "269462737111-k6vkkvn1v3s2qisuamvdr4bk0e5hbcer.apps.googleusercontent.com";

// Google login strategy
passport.use('google-login',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
        }
    
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Google signup strategy
passport.use('google-signup',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/signup/callback",
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
        }
    
        if (user) {
          return done(null, user);
        } else if (req.session.signup) {
          const newUser = new User({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
            password:"",
          });
          await newUser.save();
          req.session.signup = false; // Clear signup flag
          return done(null, newUser);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
