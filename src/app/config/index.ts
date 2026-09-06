import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 5000,
	database_url: process.env.DATABASE_URL || "",
	bak_url: process.env.APP_URL || "",
	frontend_url: process.env.FRONTEND_URL || "",
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "12",
	jwt_access_secret: process.env.JWT_ACCESS_SECRET || "",
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "365d",
	google_client_id: process.env.GOOGLE_CLIENT_ID || "",
};
