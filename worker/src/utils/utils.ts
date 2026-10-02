export class WorkerUtility {
    public static getDelay() {
        const currentTime = Date.now();
        const date = new Date();
        date.setHours(4, 0, 0, 0);

        return Math.abs(currentTime - date.getTime());
    }
}
