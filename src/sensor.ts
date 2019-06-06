import { log } from "winston";
import * as fs from 'fs';
import * as DB from "./db";
import { Client } from "pg";

let db: Client;

export async function init() {
    db = DB.getClient();
    let data = getData();
    storeData(data);
    setInterval(() => {
        data = getData();
        storeData(data);
    }, 60 * 1000);
}

// cronjob runs bme280.py script every min, writes sensor data to file
function getData(): number[] {
    let data: number[] = [3];
    let line = fs.readFileSync("/tmp/sensor", "utf8");
    let result = line.split(" ");
    data[0] = parseFloat(result[0]);
    data[1] = parseFloat(result[1]);
    data[2] = parseFloat(result[2]);
    return data;
}

function storeData(data: number[]) {
    if (!isNaN(data[0])) {
        const text = "insert into measurement (time, temperature, pressure, humidity, location_fk) values (CURRENT_TIMESTAMP, $1, $2, $3, $4)";
        const values = [cToF(data[0]), data[1], data[2], process.env.LOCATION];
        db.query(text, values, (err) => {
            if (err) {
                log("warn", "error inserting sensor data: %s", err);
            }
        });
    }
}
function cToF(c: number): number {
    return (c * 9 / 5) + 32;
}
