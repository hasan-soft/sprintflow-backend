import { redisClient } from "../../lib/redis";
import { generateOTP } from "../../utils/otp";

const sendOTP = async (email: string) => {
	const otp = generateOTP();
	const redisKey = `otp:${email.trim().toLowerCase()}`;

	await redisClient.setEx(redisKey, 300, otp);

	return { email, otp };
};

const verifyOTP = async (email: string, inputOTP: string) => {
	const redisKey = `otp:${email.trim().toLowerCase()}`;
	const storedOTP = await redisClient.get(redisKey);

	if (!storedOTP) {
		throw new Error(
			"OTP has expired or does not exist. Please request a new one.",
		);
	}

	if (storedOTP !== inputOTP) {
		throw new Error("Invalid OTP provided.");
	}

	await redisClient.del(redisKey);

	return true;
};

export const OTPService = {
	sendOTP,
	verifyOTP,
};
