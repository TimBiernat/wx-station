import * as fs from "fs";
import { Client } from "pg";
import { log } from "winston";
import * as DB from "./db";

let db: Client;
let tCorrection: number = 0;
let pCorrection: number = 0;
let hCorrection: number = 0;

export async function init(tCorr: number, pCorr: number, hCorr: number) {
    tCorrection = tCorr;
    pCorrection = pCorr;
    hCorrection = hCorr;
    db = DB.getClient();
    let data = getData();
    storeData(data);
    setInterval(() => {
        data = getData();
        if (data && data.length > 0) {
            storeData(data);
        }
    }, 60 * 1000);
}

// cronjob runs bme280.py script every min, writes sensor data to file
function getData(): number[] {
    const data: number[] = [];
    let line: string;
    try {
        line = fs.readFileSync("/tmp/sensor", "utf8");
    } catch (err) {
        log("warn", "Sensor data file not available");
    }
    if (line && line.length > 10) {
        const result = line.split(" ");
        data[0] = parseFloat(result[0]);
        data[1] = parseFloat(result[1]);
        data[2] = parseFloat(result[2]);
    } else {
        log("warn", "Sensor data not available");
    }
    return data;
}

function storeData(data: number[]) {
    if (!isNaN(data[0])) {
        const text = "insert into measurement (time, temperature, pressure, humidity, location_fk) values (CURRENT_TIMESTAMP, $1, $2, $3, $4)";
        const values = [cToF(data[0]) + tCorrection, data[1] + pCorrection, data[2] + hCorrection, process.env.LOCATION];
        db.query(text, values, (err) => {
            if (err) {
                log("warn", "error inserting sensor data: %s", err);
            }
        });
    } else {
        log("warn", "Sensor data not available");
    }
}
function cToF(c: number): number {
    return (c * 9 / 5) + 32;
}
