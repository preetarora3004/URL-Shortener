
export class Utility {
    public async generateHashCode(url: string, digits: number, attempt: number) {

        const timeStamp = Date.now()
        const data = new TextEncoder().encode(url + timeStamp + attempt)
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hash = hashArray
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        return (parseInt(hash.slice(0, 8), 16) % 10000).toString().padStart(digits, "0");
    }
}
