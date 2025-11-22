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

export async function showUserPage(req, res, next){

    const profileId = Number(req.params.id);
    if(req.user && req.user.id === profileId){
        res.render('userPage', {
            title: `${req.user.first_name} ${req.user.last_name}'s profile`,
            isOwner: true,
            user: req.user
    });
    } else{
        try{
            const user =  await userQueries.getUserById(profileId);
            
            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render('userPage', {
                title: `${user.first_name} ${user.last_name}'s profile`,
                isOwner: false
            });
        } catch (err){
            console.error("Error fetching user's page:", err);
            next(err);
        }
    }
  
}


export function showJoinClubForm(req, res, next){

    if(!req.user){
        res.status(403).send("You must sign in first.");
    }

    if(req.user.is_member){
      return res.render('error', {
      title: 'Already a member',
      message: 'You are already a club member.'
    });
    }
    res.render('joinClubForm', {
        title: 'Join Our Club'
    });
}

export async function processJoinClubForm(req, res, next){
    try {
        if (!req.user) return res.redirect("/sign-in");

        const { password } = req.body;

    
        if (password === process.env.MEMBER_SECRET) {
            await userQueries.updateUser(req.user.id, { is_member: true });
        }
        else if (password === process.env.ADMIN_SECRET){
            await userQueries.updateUser(req.user.id, { is_member: true, is_admin: true });
        }else{

            return res.render("joinClubForm", {
            title: "Join Our Club",
            errors: [{msg: "Invalid membership code"}]
        });
            
        }

        res.redirect(`/users/${req.user.id}`);
  } catch (err) {
    next(err);
  }
}
