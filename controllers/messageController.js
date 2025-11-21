import { validationResult, matchedData } from "express-validator";
import * as messageQueries from '../db/messageQueries.js';

export function showNewMessageForm(req, res){
    res.render('newMessageForm', {
        title: "New Message"
    })
}
export async function processNewMessage(req, res, next){
    console.log('creating new message', req.user.id);
    
        try{
            const result= await messageQueries.createMessage(req.body.title, req.body.text, req.user.id);
            res.redirect('/');
        } catch (err){
            next(err);
        }
}

