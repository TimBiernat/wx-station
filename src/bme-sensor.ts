import { log } from "winston";
import * as DB from "./db";
import { Client } from "pg";

let bme280: any;
let db: Client;

export async function init() {
    let elevation = 0;
    db = DB.getClient();
    if (db) {
        const result = await db.query("select elevation from location where id=1");
        elevation = result.rows[0].elevation;
    }
    try {
        const Bme280 = require('@agilatech/bme280');
        bme280 = new Bme280({ elevation: elevation });
        log("info", "bme280 sensor initialized");
        let interval = setInterval(() => {
            if (bme280 && bme280.deviceActive()) {
                log("info", "bme280 sensor active");
                clearInterval(interval);
            }
        }, 100);
    } catch(err) {
        log("warn", "bme280 sensor: %s", err);
    }
    getData();
    setInterval(() => {
        getData();
    }, 60 * 1000);
}

function getData(): void {
    if (bme280 && bme280.deviceActive()) {
        log("info", "name: %s", bme280.deviceName());
        log("info", "type: %s", bme280.deviceType());
        log("info", "version: %s", bme280.deviceVersion());

        bme280.getDataFromDevice((err: any) => {
            if (!err) {
                const pressure    = bme280.device.parameters[0].value;
                const temperature = bme280.device.parameters[1].value;
                const humidity    = bme280.device.parameters[2].value;
                const text = "insert into measurement (time, pressure, temperature, humidity, location_fk) values (CURRENT_TIMESTAMP, $1, $2, $3, $4)";
                const values = [ pressure, temperature, humidity, process.env.LOCATION ];
                db.query(text, values, (err) => {
                    if (err) {
                        log("warn", "error inserting sensor data: %s", err);
                    }
                });
            } else {
                log("warn", err);
            }
        });
    } else {
        log("warn", "sensor driver not active");
    }
}
