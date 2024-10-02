import fse from "fs-extra";
import { homedir } from "os";

import { useExec } from "@raycast/utils";
import { Form, ActionPanel, Action, popToRoot } from "@raycast/api";
import { getSecrets, parseSecrets, storeSecrets } from "./helper/secrets";

const DEFAULT_PATH = `${homedir()}/Documents/ente`;

interface PathValues {
  path?: string;
}

const entePath = "/usr/local/bin/ente";

export default function Command() {
  if (!fse.existsSync(DEFAULT_PATH)) {
    fse.mkdirSync(DEFAULT_PATH);
    useExec(entePath, ["export"]);
  }

  const allSecretsURL = getSecrets(`"${DEFAULT_PATH}/ente_auth.txt"`);
  const secrets = parseSecrets(allSecretsURL);

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: PathValues) => {
              console.log("onSubmit", values);
              storeSecrets(secrets);
              console.log(secrets);
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="path" title="Path" defaultValue={DEFAULT_PATH} />
    </Form>
  );
}
