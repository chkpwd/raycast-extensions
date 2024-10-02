import fse from "fs-extra";
import * as OTPAuth from "otpauth";
import { LocalStorage } from "@raycast/api";

export interface Secret {
  issuer: string;
  username: string;
  secret: string;
}

const STORAGE_KEY = "ente-auth-secrets";

const parseSecretURL = (url: string): Secret => {
  const totp = OTPAuth.URI.parse(url);

  return {
    issuer: totp.issuer,
    username: totp.label,
    secret: totp.secret.base32,
  };
};

export const getSecrets = (filePath: string = "ente_auth.txt"): string[] => {
  const data = fse.readFileSync(filePath, "utf8").split("\n");
  return data;
};

export const parseSecrets = (rawSecretsURLs: string[]): Secret[] => {
  const secretsList: Secret[] = [];

  rawSecretsURLs.forEach((line) => {
    line = line.trim();

    if (line) {
      try {
        secretsList.push(parseSecretURL(line));
      } catch (error) {
        console.error("Error parsing line:", line);
      }
    }
  });

  return secretsList;
};

export const storeSecrets = async (secrets: Secret[]) => {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(secrets));
};
