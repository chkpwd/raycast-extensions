import { JsonFormat, Secret } from "./types";

export const dataTransformer = (
  serviceName: string,
  username: string,
  currentTotp: string,
  currentTotpTimeRemaining: number,
  nextTotp: string
): JsonFormat => {
  return {
    service_name: serviceName,
    current_totp: currentTotp,
    current_totp_time_remaining: currentTotpTimeRemaining,
    next_totp: nextTotp,
    username,
  };
};

export const getAllSecretNames = (data: Secret[]): string[] => Object.keys(data);
