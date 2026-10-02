import type { Request, Response } from "express";
import { Service } from "../service/service";

const service = new Service();

export class Controller {
    public async createShortUrl(req: Request, res: Response) {
        try {
            const { url } = req.body;
            const userId = req.body.userId;

            if (!url || !userId) {
                throw Error("Invalid input");
            }

            const generatedHashCode = await service.createShortUrl(url, userId);

            if (!generatedHashCode) {
                throw Error("Unable to generate short url");
            }

            return res
                .json({
                    success: true,
                    shortUrl: generatedHashCode.hashedCode,
                    originalUrl: generatedHashCode.originalUrl,
                })
                .status(201);
        } catch (error) {
            res
                .json({
                    success: false,
                    error: error,
                })
                .status(500);
        }
    }

    public async fetchUrl(req: Request, res: Response) {
        try {
            const { shortUrl } = req.body;

            if (!shortUrl) {
                throw Error("Invalid input");
            }

            const hashedCode = await service.fetchUrl(shortUrl);

            if (!hashedCode) {
                throw Error("URL doesn't exists");
            }

            return res
                .json({
                    success: true,
                    redirection: true,
                    originalUrl: hashedCode.originalUrl,
                })
                .status(200);
        } catch (error) {
            return res
                .json({
                    success: false,
                    error: error,
                })
                .status(500);
        }
    }
}
