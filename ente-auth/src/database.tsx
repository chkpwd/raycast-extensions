import { homedir } from "os";

import { Form, ActionPanel, Action, popToRoot } from "@raycast/api";
import { getSecrets, parseSecrets, storeSecrets } from "./helper/secrets";

const DEFAULT_PATH = `${homedir()}/Documents/ente/ente_auth.txt`;

interface PathValues {
  path?: Date;
}

export default function Command() {
  const secretsURL = getSecrets(DEFAULT_PATH);
  const secrets = parseSecrets(secretsURL);

  storeSecrets(secrets);

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: PathValues) => {
              console.log("onSubmit", values);
              popToRoot();
              storeSecrets(secrets);
              console.log(secrets);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="path" title="Path" defaultValue={DEFAULT_PATH} />
    </Form>
  );
}
