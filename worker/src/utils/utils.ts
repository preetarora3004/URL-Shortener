export class WorkerUtility {
    public static getDelay() {
        const currentTime = Date.now();
        const date = new Date();
        date.setHours(4, 0, 0, 0);

        const time = currentTime - date.getTime();

        if (time < 0) {
            return 24 * 60 * 60 * 1000 - time;
        }

        return time;
    }
}
