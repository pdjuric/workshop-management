import express from 'express'
import { asyncQuery } from '../utils';

export class MessageController {

    get_conversations = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;

        let sql = `select * from Conversation join Workshop using (idWorkshop) where participant = ?;`
        let sqlArgs = [username]
        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        return res.json(ret.results)
    }



    add = async (req: express.Request, res: express.Response) => {
        let idConversation = req.body.idConversation;
        let sentByParticipant = req.body.sentByParticipant;
        let text = req.body.message;

        let sql = `insert into Chat (sentByParticipant, text, idConversation, dateTime) values (?, ?, ?, now());`
        let sqlArgs = [sentByParticipant, text, idConversation]

        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        return res.json('ok')
    }


    get_users_by_workshop = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;

        let sql = `select * from Conversation c join User u on u.username=c.participant where idWorkshop=?;`
        let sqlArgs = [idWorkshop]

        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        return res.json(ret.results)
    }

    get_messages = async (req: express.Request, res: express.Response) => {
        let idConversation = req.query.idConversation;

        let sql = `select * from Chat where idConversation = ? order by idMessage asc;`
        let sqlArgs = [idConversation]

        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        return res.json(ret.results)
    }


    get_conversation = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let username = req.query.participant;
        let sql = `select idConversation from Conversation where idWorkshop=? and participant=?;`
        let sqlArgs = [idWorkshop, username]

        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        let idConversation;
        if (ret.result == null) {
            sql = `insert ignore into Conversation (idWorkshop, participant, organizer) values (?, ?, (select organizer from Workshop where idWorkshop = ?))`
            sqlArgs = [idWorkshop, username, idWorkshop]
            ret = await asyncQuery(sql, sqlArgs);
            if (ret.error) return;
            idConversation = ret.result.insertId;
        } else {
            idConversation = ret.result.idConversation;
        }

        sql = `select organizer from Conversation where idConversation = ?;`
        sqlArgs = [idConversation]
        ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        res.json({
            idConversation: idConversation,
            organizer: ret.result.organizer
        })
    }

}




