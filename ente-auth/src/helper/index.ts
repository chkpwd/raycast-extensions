import * as fs from "fs";
import * as path from "path";
import * as OTPAuth from "otpauth";
import { ServiceData as SecretsJson, AlfredFormat, JsonFormat } from "./types";
import { dataTransformer } from "./transformer";
import { OutputTypes as OutputFormat } from "./types";
import { logger } from "./logger";

const DB_FILE = path.join(process.env.HOME || "", ".local", "share", "ente-totp", "db.json");

// Get command
export const generateTOTP = (secretId: string, outputFormat: OutputFormat) => {
  const items: (AlfredFormat | JsonFormat)[] = [];

  try {
    const data: SecretsJson = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

    Object.entries(data).forEach(([serviceName, serviceData]) => {
      if (serviceName.toLowerCase() === secretId.toLowerCase()) {
        serviceData.forEach(({ username, secret }) => {
          const totp = new OTPAuth.TOTP({ secret });
          const currentTotp = totp.generate();
          const currentTotpTimeRemaining = totp.period - (Math.floor(Date.now() / 1000) % totp.period);
          const nextTotp = totp.generate({ timestamp: Date.now() + 30 * 1000 });
          const formattedData = dataTransformer(
            serviceName,
            username,
            currentTotp,
            currentTotpTimeRemaining,
            nextTotp,
            outputFormat,
          );

          if (formattedData) {
            items.push(formattedData);
          }
        });
      }
    });
  } catch (err: any) {
    if (err.message.includes("no such file or directory")) {
      logger.error("Database not found. Please import secrets first.");
      return;
    }
    console.log(JSON.stringify({ items: [], error: (err as Error).message }, null, 4));
  }

  if (items.length) {
    console.log(JSON.stringify({ items }, null, 4));
  } else {
    console.log("No matching secret was found.");
  }
};

// List command
export const listSecrets = () => {
  try {
    const data: SecretsJson = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    logger.info(JSON.stringify(data, null, 4));
  } catch (err: any) {
    if (err.message.includes("no such file or directory")) {
      return logger.error("Database not found. Please import secrets first.");
    }
  }
};

export { logger };
export type { SecretsJson };
