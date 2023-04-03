import express from 'express'
import { asyncQuery, in12hrs, now, sendMail } from '../utils';

export class AttendanceController {

    reserve = async (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let idWorkshop = req.body.idWorkshop;
        let sql, response, sqlArgs;

        sql = `select count(*) as count from Workshop where idWorkshop = ? and spots_left > 0;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        console.log(response);
        if (response.result.count == 0) {
            //this means that someone got the spot before us!
            res.json({beFasterNextTime: true});
            return;
        }

        sql = `insert into WorkshopAttending values (${idWorkshop}, '${username}', 0);`;
        response = await asyncQuery(sql);
        if (response.error) return;

        res.json({ok: true});
    }

    get_past_by_user = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let sql = `select w.* from WorkshopAttending wa join Workshop w using (idWorkshop) where dateTime < '${now()}' and wa.confirmed=1 and username='${username}';`;

        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    get_future_by_user = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let sql, response;

        sql = `select w.*, wa.confirmed from WorkshopAttending wa inner join Workshop w using (idWorkshop) where wa.username = '${username}' and dateTime > '${now()}';`;
        response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    cancel = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let idWorkshop = req.query.idWorkshop;
        let sql, response;

        sql = `select count(*) as count from WorkshopAttending where idWorkshop=${idWorkshop} and username='${username}' and confirmed=1`
        response = await asyncQuery(sql);
        if (response.error) return;

        let count = response.result.count

        if (count == 1){
            sql = `update Workshop set spots_left = spots_left + 1 where idWorkshop = ${idWorkshop} and dateTime > '${in12hrs()}';`;
            response = await asyncQuery(sql);
            if (response.error) return;

            sql = `select name from Workshop where idWorkshop=${idWorkshop};`;
            response = await asyncQuery(sql);
            if (response.error) return;

            let name = response.result.name;
            sql = `select email from User join Subscription using (username) where idWorkshop=${idWorkshop}; `

            response = await asyncQuery(sql);
            if (response.error) return;
            let mails = response.results

            sql = `delete from Subscription where idWorkshop=${idWorkshop}; `
            response = await asyncQuery(sql);
            if (response.error) return;


            for (let t of mails)
                sendMail(t.email, 'Spot available!', `Workshop "${name}" has a spot available!`)

        }

        sql = `delete from WorkshopAttending where idWorkshop=${idWorkshop} and username='${username}';`;
        response = await asyncQuery(sql);
        if (response.error) return;

        res.json({ok: true});
    }



    reject = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let username = req.query.username;

        let sql = `delete from WorkshopAttending where idWorkshop=? and username=?;`
        let sqlArgs = [idWorkshop, username]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json(null);
    }

    accept = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let username = req.query.username;

        let sql = `update Workshop set spots_left = spots_left - 1 where idWorkshop=${idWorkshop};`
        let response = await asyncQuery(sql);
        if (response.error) return;

        sql = `update WorkshopAttending set confirmed=1 where idWorkshop=${idWorkshop} and username='${username}';`
        let sqlArgs = [idWorkshop, username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json(null);
    }

    get_requests = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;

        let sql = `select username from WorkshopAttending where idWorkshop=${idWorkshop} and confirmed = 0;`
        let response = await asyncQuery(sql);
        if (response.error) return;

        let users = []
        response.results.forEach(t => users.push(t.username))
        res.json({users: users})
    }

    subscribe = async (req, res) => {
        let username = req.body.username;
        let idWorkshop = req.body.idWorkshop;

        let sql = `insert into Subscription values (?, ?);`
        let sqlArgs = [username, idWorkshop]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return

        res.json(true)
    }


}
