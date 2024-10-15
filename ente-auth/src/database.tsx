import { showError } from "./components/showError";
import { DEFAULT_EXPORT_PATH } from "./constants/ente";
import { getSecrets, parseSecrets, storeSecrets } from "./helpers/secrets";
import { checkEnteBinary, createEntePath, exportEnteAuthSecrets } from "./helpers/ente";
import { checkEnteBinary, createEntePath, exportEnteAuthSecrets, deleteEnteExport } from "./helpers/ente";

export default function Command() {
  const enteBinaryExists = checkEnteBinary();
  const exportPath = getPreferenceValues().exportPath || `${DEFAULT_EXPORT_PATH}/ente_auth.txt`;

  if (!enteBinaryExists) {
    return showError();
  }

  try {
    createEntePath(exportPath);
  } catch (error) {
    showToast(Toast.Style.Failure, "Folder creation failed");
    return <Detail markdown={`## Failed to create folder at \`${exportPath}\``} />;
  }

  try {
    exportEnteAuthSecrets();
  } catch (error) {
    showToast(Toast.Style.Failure, "Export failed");
  }

  try {
    const secrets = parseSecrets(getSecrets(exportPath));
    storeSecrets(secrets);

    if (secrets.length > 0) {
      deleteEnteExport();

      showToast({
        style: Toast.Style.Success,
        title: "Secrets imported",
        message: `${exportPath}/ente_auth.txt was imported successfully.`,
      }).then(() => popToRoot());
    } else {
      showToast(Toast.Style.Failure, "No secrets found", "Please check your export path");
    }
  } catch (error) {
    showToast(Toast.Style.Failure, "Error importing secrets", "An unexpected error occurred");
  }
}
