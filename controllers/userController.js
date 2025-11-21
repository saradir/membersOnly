import { validationResult, matchedData } from "express-validator";
import * as userQueries from '../db/userQueries.js';
import bcrypt from 'bcryptjs';


export function showSignupForm(req, res){
    res.render('signupForm', {
        title: "New User"
    });
}

export async function processSignup(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("signupForm", {
        errors: errors.array(),
        oldInput: req.body // use req.body for refill
    });
    }

    const data = matchedData(req);

    try{

        const hashedPassword = await bcrypt.hash(data.password, 10);
        await userQueries.createUser(
            data.first_name,
            data.last_name,
            data.email,
            hashedPassword
        );

        res.redirect('/users/signin');
    } catch (err) {
        if (err.message === "EMAIL_TAKEN") {
            return res.status(400).render("signupForm", {
            errors: [{msg: "Email is already registered."}],
            oldInput: req.body
        });
        }
    }
    next(err);
}

export function showSigninForm(req,res){
        res.render('signinForm', {
        title: "Sign in",
        messages: req.session.messages || []

    });

    req.session.messages = []; // clear after use
}



export function signOut(req, res, next){
    req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

