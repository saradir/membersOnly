import express from 'express';
import  * as messageController from "../controllers/messageController.js";
const router = express.Router();


router.get('/new', messageController.showNewMessageForm);
router.post('/new', messageController.processNewMessage);
router.post('/:id/delete', messageController.deleteMessage);

export default router;