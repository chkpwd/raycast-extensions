import { popToRoot, showToast, Toast, getPreferenceValues, Detail } from "@raycast/api";
import { getSecrets, parseSecrets, storeSecrets } from "./helper/secrets";
import { createEntePath, exportEnteAuthSecrets } from "./helper/ente";
import { DEFAULT_EXPORT_PATH } from "./constants/ente";

export default async function Command() {
  const line_break = "\n\n";
  const submit_issue =
    "https://github.com/raycast/extensions/issues/new?assignees=&labels=extension%2Cbug&template=extension_bug_report.yml&title=%5BEnte%20Auth%5D+...";
  const ente_cli_installation_url = "https://github.com/ente-io/ente/tree/main/cli#readme";
  const toast = await showToast(Toast.Style.Animated, "Importing secrets...", "Please wait");

  createEntePath(DEFAULT_EXPORT_PATH);
  exportEnteAuthSecrets();
  const secrets = parseSecrets(getSecrets(getPreferenceValues().exportPath || `"${DEFAULT_EXPORT_PATH}/ente_auth.txt"`));

  try {
    storeSecrets(secrets);
    toast
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Import failed";
    toast.message = "Failed to import secrets";
    return;
  }

  storeSecrets(secrets);

  if (storeSecrets.length > 0) {
    showToast({
      style: Toast.Style.Success,
      title: "Secrets imported",
      message: `${getPreferenceValues().cliPath} was imported successfully.`,
    }).then(() => popToRoot());
  }
}
