import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve('./config/.env')})
const env = {
    port: process.env.PORT,
    mongodbUrl: process.env.MONGODB_URI,
}

export { env }