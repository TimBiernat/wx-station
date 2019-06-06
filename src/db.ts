import { log } from "winston";
import { Client } from "pg";

let client: Client;

export async function connect() {
    client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
    });
    await client.connect()
    log("info", "db connected: %s", process.env.DB_HOST);
}

export async function init() {
    if (client) {
        const result = await client.query("select description from location where id=" + process.env.LOCATION);
        log("info", "location: " + JSON.stringify(result.rows[0].description));
    }
}

export function getClient() {
    return client;
}