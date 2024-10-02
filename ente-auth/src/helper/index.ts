import * as OTPAuth from "otpauth";
import { dataTransformer } from "./transformer";
import { ServiceData as SecretsJson, JsonFormat } from "./types";
import { LocalStorage } from "@raycast/api";
import { STORAGE_KEY } from "./secrets";

export const listSecretsWithTOTP = (): JsonFormat[] => {
  const items: JsonFormat[] = [];
  const store = LocalStorage.getItem(STORAGE_KEY);

  try {
    const data: SecretsJson = JSON.parse(store);

    Object.entries(data).forEach(([serviceName, serviceData]) => {
      serviceData.forEach(({ username, secret }) => {
        const totp = new OTPAuth.TOTP({ secret });
        const currentTotp = totp.generate();
        const currentTotpTimeRemaining = totp.period - (Math.floor(Date.now() / 1000) % totp.period);
        const nextTotp = totp.generate({ timestamp: Date.now() + 30 * 1000 });

        const formattedData = dataTransformer(serviceName, username, currentTotp, currentTotpTimeRemaining, nextTotp);

        if (formattedData) {
          items.push(formattedData);
        }
      });
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("No such file or directory")) {
      console.error("Database not found. Please import secrets first.");
      return [];
    }
    console.error("Error reading secrets: ", err);
  }

  return items;
};

export type { SecretsJson };
