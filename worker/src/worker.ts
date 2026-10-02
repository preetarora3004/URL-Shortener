import express from "express";
import { prisma } from "@workspace/db/index";
import "dotenv/config";
import { WorkerUtility } from "./utils/utils";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

var delay = WorkerUtility.getDelay();

setInterval(async () => {
    delay = WorkerUtility.getDelay();

    const expiredUrl = await prisma.$queryRaw`
        DELETE 
        FROM "Url"
        WHERE TRUNC(
            EXTRACT(EPOCH FROM (NOW() - "createdAt"))
            / (30 * 24 * 60 * 60)
        ) > "clicks";
        `;
}, delay);

try {
    app.listen(PORT, () => {
        console.log(`Worker is running on the ${PORT}`);
    });
} catch {
    console.log(`Unable to start worker`);
    process.exit(1);
}
