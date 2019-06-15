import { Request, Response } from "express";
import * as db from "./db";
import { log } from "winston";

export async function location(req: Request, res: Response, locationParam: string) {
    const locationId = req.params[locationParam];
    const client = db.getClient();
    const result = await client.query("select description from location where id=" + locationId);
    log("info", "location: " + JSON.stringify(result.rows[0].description));
    res.json(result.rows);
}

export async function get(req: Request, res: Response, valueParam: string, locationParam: string) {
    const locationId = req.params[locationParam];
    const value = req.params[valueParam];
    const client = db.getClient();
    const result = await client.query("select time," + value + " from measurement where location_fk="
        + locationId + " order by id desc limit 1");
    res.json(result.rows);
}

export async function query(req: Request, res: Response, valueParam: string, locationParam: string, start: string, end: string) {
    const locationId = req.params[locationParam];
    const value = req.params[valueParam];
    const startDate = req.params[start];
    const endDate = req.params[end];
    const client = db.getClient();
    const result = await client.query("select time," + value + " from measurement where location_fk="
        + locationId + " and time between symmetric '" + startDate + "' and '" + endDate + "'");
    res.json(result.rows);
}