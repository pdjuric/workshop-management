import express from 'express'
import { asyncQuery } from '../utils';

export class LikeController {

    get_workshops = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let sql = `select * from WorkshopLikes join Workshop using (idWorkshop) where username = ?;`;
        let sqlArgs = [username]

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        return res.json(response.results);
    }

    delete = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let idWorkshop = req.query.idWorkshop;
        let sql, response, sqlArgs;

        sql = `delete from WorkshopLikes where username=? and idWorkshop=?;`;
        sqlArgs = [username,idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        sql = `UPDATE Workshop SET like_count = like_count - 1 WHERE idWorkshop = ?;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json({ok: true});
    }

    like = async (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let idWorkshop = req.body.idWorkshop;
        let sql, response, sqlArgs;

        sql = `insert into WorkshopLikes values (?, ?);`;
        sqlArgs = [idWorkshop, username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        sql = `UPDATE Workshop SET like_count = like_count + 1 WHERE idWorkshop = ?;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        return res.json({ok: true});
    }

}
