export class CacheService {
    public static cache: Map<string, { originalUrl: string; ttl: number }>;

    constructor() {
        CacheService.cache = new Map();
    }

    public updateTTL(hashedCode: string) {
        const cache = CacheService.cache.get(hashedCode);
        if (!cache || !cache.ttl) {
            return;
        }
        cache.ttl = Date.now() + 5 * 60 * 1000;
        return cache;
    }

    public addCache(hashedCode: string, originalUrl: string) {
        const isExist = CacheService.cache.has(hashedCode);

        if (isExist) {
            throw Error("Already existst");
        }

        CacheService.cache.set(hashedCode, {
            originalUrl: originalUrl,
            ttl: Date.now() + 5 * 60 * 1000,
        });

        const cache = CacheService.cache.get(hashedCode);

        return cache;
    }

    private removeCache(hashedCode: string) {
        return CacheService.cache.delete(hashedCode);
    }

    public checkCache(hashedCode: string) {
        const code = CacheService.cache.get(hashedCode);

        if (code && code.ttl > Date.now()) {
            return {
                success: true,
                cached: code,
            };
        } else if (code && code.ttl <= Date.now()) {
            return {
                success: false,
                body: "expired",
            };
        } else {
            return {
                success: false,
                body: "miss",
            };
        }
    }
}
