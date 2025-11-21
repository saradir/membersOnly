import { getAllMessages } from "../db/messageQueries.js";


export async function getIndex(req, res){
    const messages = await getAllMessages();
    res.render('index', {
        title: 'Home',
        user: req.user,
        messages
    });
}