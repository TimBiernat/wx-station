import * as expserver from "express";
import { log } from "winston";
import * as config from "./config";
import * as db from "./db";
import * as sensor from "./sensor";

async function run() {
    try {
        await config.env();
        await config.logger();
        await db.connect();
        await db.init();
        await sensor.init();
        const app = expserver();
        await config.express(app);
        app.listen(getPort(), () => {
            log("info", "server listening on port %s", getPort());
        });
    } catch (err) {
        log("error", "Shutting down: %s", err);
        process.exit(1);
    }
}

function getPort(): string {
    let port = process.env.PORT;
    if (port === undefined) {
        port = "8080";
    }
    return port;
}

run();
