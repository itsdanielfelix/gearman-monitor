interface HeaderProps {
  host: string;
  port: number;
  isConnected: boolean;
}

export function Header({ host, port, isConnected }: HeaderProps) {
  const statusColor = isConnected ? "#00FF00" : "#FF6B6B";
  const statusText = isConnected ? "Connected" : "Disconnected";

  return (
    <box
      flexDirection="column"
      alignItems="center"
      paddingY={1}
      border
      borderStyle="single"
      marginBottom={1}
    >
      <ascii-font font="tiny" text="Gearman Monitor" />
      <box flexDirection="row" gap={2} marginTop={1}>
        <text fg="#888888">{"Server: "}</text>
        <text>{host}:{port}</text>
        <text fg={statusColor}>{"[" + statusText + "]"}</text>
      </box>
    </box>
  );
}
