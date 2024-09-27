import { ActionPanel, Action, List, showToast } from "@raycast/api";
import fs from "fs";
import path from "path";
import { SecretsJson, logger } from "./helper";

const DB_FILE = path.join(process.env.HOME || "", ".local", "share", "ente-totp", "db.json");

export const listSecrets = (): SecretsJson | null => {
  try {
    const data: SecretsJson = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return data;
  } catch (err: any) {
    if (err.message.includes("no such file or directory")) {
      logger.error("Database not found. Please import secrets first.");
    } else {
      logger.error(`Error reading secrets: ${err.message}`);
    }
    return null;
  }
};

export default function Command() {
  const secrets = listSecrets();

  if (!secrets) {
    return (
      <List>
        <List.Item title="No secrets found or unable to read secrets." />
      </List>
    );
  }

  const items = Object.keys(secrets);

  return (
    <List>
      {items.map((item) => (
        <List.Item
          key={item}
          title={item}
          actions={
            <ActionPanel>
              <Action
                title={`Select Secret ${item}`}
                onAction={async () => {
                  await showToast({
                    title: `You selected secret ${item}`,
                    message: `Secret ${item} has been chosen.`,
                  });
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
