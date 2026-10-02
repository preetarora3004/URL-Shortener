import express from 'express'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

try {
    app.listen(PORT, () => {
        console.log(`Server is listening on the ${PORT}`)
    })
}
catch {
    console.log(`Unable to start server`)
    process.exit(1)
}
