import { Repository } from "../repository/repository";
import { Utility } from "../utility/util";
import { CacheService } from "../cache/cache";

export class Service {
    private cacheService = new CacheService();
    private repo = new Repository();
    private util = new Utility();

    public async registerUser(username: string, password: string) {
        if (!username || !password) {
            throw Error("Invalid Input");
        }

        const user = await this.repo.createUser({ username, password });

        return user;
    }

    public async createShortUrl(url: string, userId: string) {
        var attempt = 1;
        var digits = 4;
        var code: string;

        if (!url) {
            throw Error("Invalid Input");
        }

        code = await this.util.generateHashCode(url, 4, 1);

        var isExist: any = await Repository.client.url.findUnique({
            where: {
                hashedCode: code,
            },
        });

        if (isExist) {
            code = await this.retries(attempt, digits, url);
            if (code.length <= 0) {
                throw Error("Unable to generate url at this moment");
            }
        }

        const shortUrl = await Repository.client.url.create({
            data: {
                userId: userId,
                originalUrl: url,
                hashedCode: code,
            },
        });

        this.cacheService.addCache(code, url);
        return shortUrl;
    }

    public async fetchUrl(shortUrl: string) {
        const hashedCode = shortUrl.at(1) as string;
        const isExist = this.cacheService.checkCache(hashedCode);

        if (isExist && isExist.success && isExist.cached) {
            this.cacheService.updateTTL(hashedCode);
            return isExist.cached;
        } else if (isExist && !isExist.success && isExist.body === "expired") {
            const cache = this.cacheExpired(hashedCode);
            return cache;
        } else if (isExist && !isExist.success && isExist.body === "miss") {
            const cache = await this.cacheMiss(hashedCode);
            return cache;
        }
    }

    private cacheExpired(hashedCode: string) {
        const cache = this.cacheService.updateTTL(hashedCode);

        if (!cache) {
            throw Error("Unable to update");
        }
        return cache;
    }

    private async cacheMiss(hashedCode: string) {
        const code = await Repository.client.url.findUnique({
            where: {
                hashedCode: hashedCode,
            },
        });

        if (!code) {
            throw Error("URL doesn't exists");
        }

        const cache = this.cacheService.addCache(hashedCode, code.originalUrl);

        return cache;
    }

    private async retries(attempt: number, digit: number, url: string) {
        let flag: boolean = true;
        let code: string = "";
        let isExist: any;

        while (flag) {
            attempt++;

            if (attempt >= 3) {
                code = await this.util.generateHashCode(url, digit++, attempt++);
                isExist = await Repository.client.url.findUnique({
                    where: {
                        hashedCode: code,
                    },
                });
            } else {
                code = await this.util.generateHashCode(url, digit, attempt);
                isExist = await Repository.client.url.findUnique({
                    where: {
                        hashedCode: code,
                    },
                });
            }

            if (!isExist) {
                flag = false;
                return code;
            }
        }

        return code;
    }
}
