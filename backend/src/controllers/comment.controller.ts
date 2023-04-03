import express from 'express'
import { asyncQuery } from '../utils';

export class CommentController {

    get_by_username = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;

        let sql = `select w.*, CONCAT('[',GROUP_CONCAT(JSON_OBJECT("idComment", idComment,"text", text)), ']') as comments ` +
            `from Comment join Workshop w using (idWorkshop) ` +
            `where username = ? ` +
            `group by (idWorkshop);`
        let sqlArgs = [ username ]
        let ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        let t = ret.results.map(res => {
            let r = {workshop: null, comments: JSON.parse(res.comments)}
            delete res.comments;
            r.workshop = res;
            return r
        })
        return res.json(t)
    }

    update = async (req: express.Request, res: express.Response) => {
        let idComment = req.body.idComment;
        let text = req.body.text;

        let sql = `update Comment set text = ? where idComment = ? ;`
        let sqlArgs = [text, idComment]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json({ok: true});
    }

    delete = async (req: express.Request, res: express.Response) => {
        let idComment = req.query.idComment;

        let sql = `delete from Comment where idComment=${idComment};`
        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json({ok: true});
    }

    get_by_workshop = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let username = req.query.username;

        let sql, ret, sqlArgs;
        sql = `select count(*) as count from Workshop w join Workshop w2 on w.name=w2.name join WorkshopAttending wa on w2.idWorkshop=wa.idWorkshop where w.idWorkshop = ? and wa.username = ? and w2.dateTime < now() and wa.confirmed = 1;`
        sqlArgs = [idWorkshop, username]
        ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        let flag = ret.result.count
        if (flag == 0)
            return res.json(null);

        sql = `select c.idComment, c.username, c.text, c.dateTime, u.first_name, u.image from Comment c join User U using (username) where idWorkshop = ${idWorkshop};`

        ret = await asyncQuery(sql);
        if (ret.error) return;

        return res.json(ret.results)
    }

    add = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.body.idWorkshop;
        let username = req.body.username;
        let text = req.body.text

        let sql, ret, sqlArgs;
        sql = `insert into Comment (idWorkshop, username, text, dateTime) values (?, ?, ?, now());`
        sqlArgs = [idWorkshop, username, text]
        ret = await asyncQuery(sql, sqlArgs);
        if (ret.error) return;

        return res.json(true)
    }
}
