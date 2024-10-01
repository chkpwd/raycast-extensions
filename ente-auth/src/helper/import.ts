import { LocalStorage } from "@raycast/api";
import { parseSecrets, Secret } from "./secrets";

type SecretResult = Omit<Secret, "issuer">;

const importSecrets = async (file: string) => {
  const rawSecrets = parseSecrets(file);
  const result: Record<string, SecretResult[]> = {};

  rawSecrets.forEach((data) => {
    const item = {
      secret: data.secret,
      username: data.username,
    };

    if (data.issuer in result) {
      result[data.issuer].push(item);
    } else {
      result[data.issuer] = [item];
    }
  });

  // Store secrets in LocalStorage
  for (const [issuer, secrets] of Object.entries(result)) {
    await LocalStorage.setItem(issuer, JSON.stringify(secrets));
  }

  console.log(LocalStorage.allItems());
};

