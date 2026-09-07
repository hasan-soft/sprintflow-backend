import path from "node:path";
import dotenv from "dotenv";

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

  // Admin Credential
  admin_name: process.env.ADMIN_NAME || "Admin",
  admin_email: process.env.ADMIN_EMAIL || "admin@gmail.com",
  admin_password: process.env.ADMIN_PASSWORD || "admin@1234",

  // Manager Credential
  manager_name: process.env.MANAGER_NAME || "Manager",
  manager_email: process.env.MANAGER_EMAIL || "manager@gmail.com",
  manager_password: process.env.MANAGER_PASSWORD || "manager@1234",

  // Member Credential
  member_name: process.env.MEMBER_NAME || "Member",
  member_email: process.env.MEMBER_EMAIL || "member@gmail.com",
  member_password: process.env.MEMBER_PASSWORD || "member@1234",


  // Redis
  redis_user: process.env.REDIS_USER || "default",
  redis_password: process.env.REDIS_PASSWORD || "",
  redis_host: process.env.REDIS_HOST || "",
  redis_port: process.env.REDIS_PORT || "12624",
};
