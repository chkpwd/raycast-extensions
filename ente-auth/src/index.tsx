import { getProgressIcon } from "@raycast/utils";
import { ActionPanel, Action, List } from "@raycast/api";
import { listSecretsWithTOTP } from "./helper";

export default function Command() {
  const secrets = listSecretsWithTOTP();

  if (secrets.length === 0) {
    return (
      <List>
        <List.Item title="No secrets found or unable to read secrets." />
      </List>
    );
  }

  return (
    <List
      navigationTitle="Get TOTP"
      searchBarPlaceholder="Search..."
    >
      {secrets.map((item, index) => (
        <List.Item
          key={index}
          title={item.service_name}
          subtitle={item.username}
          keywords={[item.service_name, item.username ?? ""]}
          accessories={[
            {
              tag: item.current_totp,
            },
            {
              tag: item.current_totp_time_remaining.toString(),
            },
          ]}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title={"Copy TOTP"}
                icon={getProgressIcon(item.current_totp_time_remaining)}
                content={item.current_totp}
                concealed={true}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
