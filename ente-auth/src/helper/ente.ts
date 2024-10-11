import fse from "fs-extra";
import { execSync } from "child_process";
import { getPreferenceValues } from "@raycast/api";
import { DEFAULT_EXPORT_PATH } from "../constants/ente";

const DEFAULT_CLI_PATH = getPreferenceValues().cliPath || "/usr/local/bin/ente";

export const createEntePath = (path: string): string => {
  if (!fse.existsSync(path)) {
    fse.mkdirSync(path);
    console.log("Ente folder created at", path);
  }

  return path;
};

export const checkEnteBinary = (): boolean => {
  try {
    execSync(`${DEFAULT_CLI_PATH} version`);
    return true;
  } catch (error) {
    console.log("Ente binary not found. Please install it.");
    return false;
  }
};

export const exportEnteAuthSecrets = (): void => {
  if (!fse.existsSync(`${DEFAULT_EXPORT_PATH}/ente_auth.txt`)) {
    console.log("ente_auth.txt not found. Exporting...");
    execSync("ente export");

    if (!fse.existsSync(`${DEFAULT_EXPORT_PATH}/ente_auth.txt`)) {
      throw new Error("Export failed.");
    }
  } else {
    throw new Error("Skipping export...");
  }

  throw new Error("An unknown error occurred.");
};
