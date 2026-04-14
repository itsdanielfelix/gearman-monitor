import { type FunctionStatus } from "../lib/gearman";

interface FunctionListProps {
  functions: FunctionStatus[];
}

function padLeft(str: string | number, width: number): string {
  const s = String(str);
  return s.padStart(width, " ");
}

export function FunctionList({ functions }: FunctionListProps) {
  return (
    <box
      flexDirection="column"
      border
      borderStyle="single"
      title="Functions"
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
        <text fg="#00FFFF" width={25}>{"Function Name"}</text>
        <text fg="#00FFFF" width={8}>{"Total"}</text>
        <text fg="#00FFFF" width={8}>{"Running"}</text>
        <text fg="#00FFFF" width={8}>{"Workers"}</text>
      </box>
      <scrollbox flexGrow={1} focused>
        {functions.length === 0 ? (
          <box padding={1}>
            <text fg="#888888">{"No functions registered"}</text>
          </box>
        ) : (
          functions.map((fn, index) => (
            <box
              key={fn.name}
              flexDirection="row"
              paddingX={1}
              paddingY={0}
              backgroundColor={index % 2 === 0 ? undefined : "#1a1a2e"}
            >
              <text width={25}>{fn.name}</text>
              <text width={8} fg="#888888">{padLeft(fn.total, 5)}</text>
              <text width={8} fg={fn.running > 0 ? "#00FF00" : "#888888"}>{padLeft(fn.running, 7)}</text>
              <text width={8} fg={fn.availableWorkers > 0 ? "#00FF00" : "#FF6B6B"}>{padLeft(fn.availableWorkers, 6)}</text>
            </box>
          ))
        )}
      </scrollbox>
    </box>
  );
}
