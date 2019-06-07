import { log } from "winston";
import { Client } from "pg";
var os = require('os');

let client: Client;

export async function connect() {
    let host = process.env.DB_HOST;
    // if (!host) {
    //     let iface = os.networkInterfaces();
    //     // local dev machine
    //     if (iface.en0 && iface.en0[1].address) {
    //         host = iface.en0[1].address;
    //     }
    //     // local pi wifi
    //     if (iface.wlan0 && iface.wlan0[1].address) {
    //         host = iface.wlan0[1].address;
    //     }
    // }
    // log("info", "DB_HOST: %s", host);
    client = new Client({
        user: process.env.DB_USER,
        host: host,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
    });
    await client.connect()
    log("info", "db connected: %s", host);
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