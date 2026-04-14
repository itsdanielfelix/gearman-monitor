interface StatusBarProps {
  lastUpdated: Date | null;
  workerCount: number;
  functionCount: number;
  error: string | null;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function StatusBar({ lastUpdated, workerCount, functionCount, error }: StatusBarProps) {
  const timeStr = lastUpdated ? formatTime(lastUpdated) : "--:--:--";

  return (
    <box
      flexDirection="row"
      justifyContent="space-between"
      paddingX={1}
      paddingY={0}
      border
      borderStyle="single"
      marginTop={1}
    >
      <box flexDirection="row" gap={3}>
        <text>{"Updated: "}<span fg="#00FFFF">{timeStr}</span></text>
        <text>{"Functions: "}<span fg="#FFFF00">{functionCount}</span></text>
        <text>{"Workers: "}<span fg="#FFFF00">{workerCount}</span></text>
        {error && (
          <text fg="#FF6B6B">{"[Error: " + error + "]"}</text>
        )}
      </box>
      <text fg="#888888">{"s: settings | q/ESC: exit"}</text>
    </box>
  );
}
