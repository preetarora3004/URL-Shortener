import { prisma } from "@workspace/db/index"
import type { PrismaClient } from "../../../db/generated/prisma/client"

export class Repository {
    public static client: PrismaClient

    constructor() {
        Repository.client = prisma
    }

    public async createUser(data: { username: string, password: string }) {
        return await Repository.client.user.create({
            data: {
                username: data.username,
                password: data.password
            }
        })

    }
}
