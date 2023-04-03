import express from 'express'
import { asyncQuery, sendMail } from '../utils';


export class WorkshopController {

    add = async (req, res) => {
        let workshop_data = req.body;
        let filename = req.file?.filename;

        if ('old_main_image' in workshop_data) {
            filename = workshop_data['old_main_image']
        }

        console.log(workshop_data)
        let sql = `insert into Workshop (name, dateTime, place, description, long_description, organizer, main_image, spots, spots_left, map, like_count, confirmed) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?);`
        let sqlArgs = [
          workshop_data.name,
            workshop_data.dateTime,
            workshop_data.place,
            workshop_data.description,
            workshop_data.long_description,
            workshop_data.organizer,
            filename,
            workshop_data.spots,
            workshop_data.spots,
            workshop_data.map,
            JSON.parse(workshop_data.isAdmin ?? 'false')  ? 1:  0
        ]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        let idWorkshop = response.result.insertId

        if ('existingImages' in workshop_data) {
            let existingImages = JSON.parse(workshop_data['existingImages'])
            console.log(existingImages)
            for (let i of existingImages) {
                let no = i.no;
                let filename = i.image;

                sql = `insert into WorkshopImages values (?, ?, ?);`;
                sqlArgs = [idWorkshop, filename, no]
                response = await asyncQuery(sql, sqlArgs);
                if (response.error) return;

            }
        }
        res.json({idWorkshop: idWorkshop});
    }

    get_active = async (req: express.Request, res: express.Response) => {
        let sql = `select row_number() over (order by like_count) as no, w.* from Workshop w where dateTime > now() and confirmed=1;`;

        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    get_top = async (req: express.Request, res: express.Response) => {
        let sql = `select row_number() over (order by like_count desc) as no, w.* from Workshop w where confirmed=1 order by w.like_count desc limit 5;`;

        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    get_details = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let username = req.query.username;
        let sql, response, sqlArgs;

        sql = `select * from Workshop w where idWorkshop=?;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        if (response.results == null || response.results.length == 0) return res.json(null);
        let data = response.result;

        sql = `select count(*) as count from Subscription w where idWorkshop=? and username=?;`;
        sqlArgs = [idWorkshop, username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        data.willBeNotified = response.result.count == 1;

        sql = `select no, image from WorkshopImages where idWorkshop=?;`
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        data.gallery = response.results;

        sql = `select confirmed from WorkshopAttending where idWorkshop=? and username=?;`
        sqlArgs = [idWorkshop, username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        data.attendingConfirmed = response.result?.confirmed ?? null;


        sql = `select count(*) as count from Workshop w1 inner join Workshop w2 using (name) join WorkshopAttending wa on w2.idWorkshop=wa.idWorkshop where w1.idWorkshop=? and username=? and w2.dateTime < now() and wa.confirmed = 1;`
        sqlArgs = [idWorkshop, username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        if (response.result.count != 0) {
            sql = `select count(*) as alreadyLiked from WorkshopLikes where idWorkshop=? and username=?; `
            sqlArgs = [idWorkshop, username]
            response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;
            data.alreadyLiked = response.result.alreadyLiked;

        } else {
            data.alreadyLiked = null;
        }

        res.json(data)
    }

    upload_gallery = async (req, res) => {
        let idWorkshop = req.body.idWorkshop;

        let no = 0;
        let sql = `insert into WorkshopImages values `
        let sqlArgs = []
        req.files.forEach(f => {
            sql += '(?, ?, ?),';
            sqlArgs.push(idWorkshop)
            sqlArgs.push(f.filename)
            sqlArgs.push(no++)
        })

        sql = sql.slice(0, -1) + ';'

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        return res.json({ok: true});
    }

    get_by_organizer = async (req: express.Request, res: express.Response) => {
        let username = req.query.username;
        let sql, response, sqlArgs;

        sql = `select * from Workshop w where organizer=? and confirmed = 1;`;
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        return res.json(response.results);
    }


    get_template = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;
        let sql, response, sqlArgs;

        sql = `select name, dateTime, place, description, long_description, spots, map, main_image from Workshop w where idWorkshop=?;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        let info = response.result


        sql = `select image from WorkshopImages wi where idWorkshop=? order by no asc;`;
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        let gallery = []
        response.results.forEach(r => gallery.push(r.image))
        info.gallery = gallery;

        console.log(info)
        return res.json(info);
    }


    get_edit = async (req: express.Request, res: express.Response) => {
        let idWorkshop = req.query.idWorkshop;

        let sql = `select name, dateTime, place, description, long_description, organizer, main_image, spots, spots_left, map from Workshop where idWorkshop = ?;`
        let sqlArgs = [idWorkshop]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        let data = response.result

        sql = `select no, image from WorkshopImages where idWorkshop=?;`
        sqlArgs = [idWorkshop]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        data.gallery = response.results;

        return res.json(data);

    }

    edit = async (req, res) => {
        let idWorkshop = req.body.idWorkshop;
        let data = req.body.data;
        let filename = req.file?.filename;

        let sql = `update Workshop set name=?, place=?, dateTime=?, spots_left = spots_left +? -spots,  spots=?, description=?, long_description=?, map=? where idWorkshop=?`;
        let sqlArgs = [
            data.name,
            data.place,
            data.dateTime,
            data.spots,
            data.spots,
            data.description,
            data.long_description,
            data.map,
            idWorkshop
        ]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        if (filename) {
            let sql = `update Workshop set main_image=? where idWorkshop=?`;
            let sqlArgs = [
                filename,
                idWorkshop
            ]
            let response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

        }

        if (data.new_spots == true) {
            let sql = `select name from Workshop where idWorkshop=?;`;
            let sqlArgs = [ idWorkshop ]
            let response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

            let name = response.result.name;
            sql = `select email from User join Subscription using (username) where idWorkshop=?; `
            sqlArgs = [ idWorkshop ]
            response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

            sql = `delete from Subscription where idWorkshop=?; `
            sqlArgs = [ idWorkshop ]
            response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

            for (let t of response.results)
                sendMail(t.email, 'Spot available!', `Workshop "${name}" has a spot available!`)

        }

        res.json(true)
    }

    edit_gallery = async (req, res) => {
        let no = req.query.no;
        let idWorkshop = req.query.idWorkshop;
        let filename = req.file?.filename;

        let sql = `delete from WorkshopImages where idWorkshop=${idWorkshop} and no=${no};`
        let response = await asyncQuery(sql);
        if (response.error) return;

        if (filename != null) {
            sql = `insert into WorkshopImages values (${idWorkshop}, '${filename}', ${no});`;
            response = await asyncQuery(sql);
            if (response.error) return;
        }

        res.json(true)
    }


    cancel = async (req, res) => {
        let idWorkshop = req.query.idWorkshop;

        let sql = `select * from Workshop where idWorkshop=${idWorkshop}`
        let response = await asyncQuery(sql);
        if (response.error) return;

        let name = response.result.name;
        //send mail to everyone
         sql = `select email from User join WorkshopAttending using(username) where idWorkshop=${idWorkshop}`
         response = await asyncQuery(sql);
        if (response.error) return;

        for (let t of response.results)
            sendMail(t.email, 'Workshop cancelled', `Workshop "${name}" is cancelled.`)

        sql = `delete from Workshop where idWorkshop=${idWorkshop};`
        response = await asyncQuery(sql);
        if (response.error) return;

        res.json(true)
    }

    get_pending  = async (req, res) => {
        let sql = `select * from Workshop where confirmed=0 and organizer not in (select distinct(username) from WorkshopAttending wa join Workshop w using (idWorkshop) where w.dateTime > now());`
        let response = await asyncQuery(sql)
        if (response.error) return

        res.json(response.results)
    }

    accept  = async (req, res) => {
        let idWorkshop = req.query.idWorkshop
        let sql = `update Workshop set confirmed=1 where idWorkshop=${idWorkshop};`
        let response = await asyncQuery(sql)
        if (response.error) return

        sql = `select organizer from Workshop where idWorkshop=${idWorkshop};`
        response = await asyncQuery(sql)
        if (response.error) return

        let username = response.result.organizer

        sql = `update User set user_type='organizer' where username=?;`
        let sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs)
        if (response.error) return

        res.json(true)
    }

    reject  = async (req, res) => {
        let idWorkshop = req.query.idWorkshop
        let sql = `delete from Workshop where idWorkshop=${idWorkshop};`
        let response = await asyncQuery(sql)
        if (response.error) return

        res.json(true)
    }
}
