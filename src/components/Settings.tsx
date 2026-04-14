import { useState, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import type { KeyEvent } from "@opentui/core";

export interface ServerConfig {
  host: string;
  port: number;
}

interface SettingsProps {
  config: ServerConfig;
  onSave: (config: ServerConfig) => void;
  onCancel: () => void;
}

type FocusTarget = "host" | "port" | "buttons";

export function Settings({ config, onSave, onCancel }: SettingsProps) {
  const [host, setHost] = useState(config.host);
  const [port, setPort] = useState(String(config.port));
  const [error, setError] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>("host");

  const handleSave = useCallback(() => {
    const trimmedHost = host.trim();
    const portNum = parseInt(port, 10);

    if (!trimmedHost) {
      setError("Host cannot be empty");
      return;
    }

    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setError("Port must be between 1 and 65535");
      return;
    }

    onSave({ host: trimmedHost, port: portNum });
  }, [host, port, onSave]);

  const handleButtonSelect = useCallback((index: number) => {
    if (index === 0) {
      handleSave();
    } else {
      onCancel();
    }
  }, [handleSave, onCancel]);

  const handleKeyDown = useCallback((key: KeyEvent) => {
    if (key.name === "escape") {
      onCancel();
    } else if (key.name === "tab" && !key.shift) {
      if (focusTarget === "host") {
        setFocusTarget("port");
      } else if (focusTarget === "port") {
        setFocusTarget("buttons");
      }
    } else if (key.name === "tab" && key.shift) {
      if (focusTarget === "buttons") {
        setFocusTarget("port");
      } else if (focusTarget === "port") {
        setFocusTarget("host");
      }
    } else if (key.name === "enter") {
      if (focusTarget === "host") {
        setFocusTarget("port");
      } else if (focusTarget === "port") {
        handleSave();
      }
    }
  }, [focusTarget, handleSave, onCancel]);

  useKeyboard(handleKeyDown);

  return (
    <box
      position="absolute"
      left={0}
      top={0}
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <box
        position="absolute"
        left={0}
        top={0}
        width="100%"
        height="100%"
        backgroundColor="#000000"
        opacity={0.7}
      />
      <box
        flexDirection="column"
        border
        borderStyle="single"
        padding={2}
        backgroundColor="#1a1a2e"
      >
        <text fg="#00FFFF" marginBottom={1}>{"┌─ Settings ─"}</text>
        
        <box flexDirection="row" marginBottom={1}>
          <text width={8}>{"Host:"}</text>
          <box border width={26} paddingX={1}>
            <input
              value={host}
              onChange={setHost}
              width={24}
              backgroundColor="#0a0a1a"
              textColor="#00FF00"
              focused={focusTarget === "host"}
            />
          </box>
        </box>

        <box flexDirection="row" marginBottom={1}>
          <text width={8}>{"Port:"}</text>
          <box border width={26} paddingX={1}>
            <input
              value={port}
              onChange={setPort}
              width={24}
              backgroundColor="#0a0a1a"
              textColor="#00FF00"
              focused={focusTarget === "port"}
            />
          </box>
        </box>

        {error ? (
          <text fg="#FF6B6B" marginBottom={1}>{"│ Error: " + error}</text>
        ) : (
          <box marginBottom={1}><text>{"│"}</text></box>
        )}

        <box marginBottom={1}><text>{"├──────────────────────────────"}</text></box>

        <tab-select
          options={[
            { name: "Save", description: "Save settings" },
            { name: "Cancel", description: "Discard changes" },
          ]}
          onSelect={handleButtonSelect}
          tabWidth={14}
          focused={focusTarget === "buttons"}
        />

        <text fg="#888888" marginTop={1}>{"Tab: navigate | Enter: select | ESC: cancel"}</text>
      </box>
    </box>
  );
}
