import { validationResult, matchedData } from "express-validator";
import * as messageQueries from '../db/messageQueries.js';

export function showNewMessageForm(req, res){
    res.render('newMessageForm', {
        title: "New Message"
    })
}
export async function processNewMessage(req, res, next){  
        try{
            const result= await messageQueries.createMessage(req.body.title, req.body.text, req.user.id);
            res.redirect('/');
        } catch (err){
            next(err);
        }
}

export async function deleteMessage(req, res, next){
    try{
        if (!req.user) {
        return res.status(403).send("You must be signed in.");
        }

        if (!req.user.is_admin) {
        return res.status(403).send("Permission denied: admin only.");
        }

        const deletedMessage = await messageQueries.deleteMessage(req.params.id);
        if (!deletedMessage) {
        return res.status(404).send("Message not found.");
        }

        res.redirect('/');
    } catch (err) {
        next(err);
    }
}
