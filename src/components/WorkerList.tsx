import { type Worker } from "../lib/gearman";

interface WorkerListProps {
  workers: Worker[];
}

export function WorkerList({ workers }: WorkerListProps) {
  return (
    <box
      flexDirection="column"
      border
      borderStyle="single"
      title="Workers"
      titleAlignment="left"
      flexGrow={1}
      minHeight={8}
    >
      <box
        flexDirection="row"
        paddingX={1}
        paddingY={0}
        backgroundColor="#2a2a4a"
      >
        <text fg="#00FFFF" width={6}>FD</text>
        <text fg="#00FFFF" width={16}>IP Address</text>
        <text fg="#00FFFF" width={15}>Client ID</text>
        <text fg="#00FFFF">Functions</text>
      </box>
      <scrollbox flexGrow={1} focused>
        {workers.length === 0 ? (
          <box padding={1}>
            <text fg="#888888">No workers connected</text>
          </box>
        ) : (
          workers.map((worker, index) => (
            <box
              key={worker.fd}
              flexDirection="row"
              paddingX={1}
              paddingY={0}
              backgroundColor={index % 2 === 0 ? undefined : "#1a1a2e"}
            >
              <text width={6} fg="#888888">{worker.fd}</text>
              <text width={16}>{worker.ip}</text>
              <text width={15} fg="#FFFF00">
                {worker.clientId || "(none)"}
              </text>
              <text fg="#00FF00">
                {worker.functions.length > 0
                  ? worker.functions.join(", ")
                  : "(no functions)"}
              </text>
            </box>
          ))
        )}
      </scrollbox>
    </box>
  );
}
