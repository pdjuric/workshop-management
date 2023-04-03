import express from 'express'
import {MessageController} from '../controllers/message.controller';

const messageRouter = express.Router();

messageRouter.route('/conversations').get((req, res) =>  new MessageController().get_conversations(req, res))

messageRouter.route('').get((req, res) =>  new MessageController().get_messages(req, res))

messageRouter.route('').post((req, res) =>  new MessageController().add(req, res))

messageRouter.route('/users').get((req, res) =>  new MessageController().get_users_by_workshop(req, res))

messageRouter.route('/conversation').get((req, res) =>  new MessageController().get_conversation(req, res))



export default messageRouter;

