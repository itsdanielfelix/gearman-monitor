import { useState } from "react";
import { useRenderer, useKeyboard } from "@opentui/react";
import { Header } from "./components/Header";
import { FunctionList } from "./components/FunctionList";
import { WorkerList } from "./components/WorkerList";
import { StatusBar } from "./components/StatusBar";
import { Settings, type ServerConfig } from "./components/Settings";
import { useGearman } from "./hooks/useGearman";

const DEFAULT_CONFIG: ServerConfig = {
  host: "localhost",
  port: 4730,
};

const REFRESH_INTERVAL = 2000;

function App() {
  const renderer = useRenderer();
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ServerConfig>(DEFAULT_CONFIG);

  const { functions, workers, error, isConnected, lastUpdated } = useGearman({
    host: config.host,
    port: config.port,
    refreshInterval: REFRESH_INTERVAL,
  });

  useKeyboard((key) => {
    if (key.name === "q" || key.name === "escape") {
      if (showSettings) {
        setShowSettings(false);
      } else {
        renderer.destroy();
      }
    } else if (key.name === "s" && !showSettings) {
      setShowSettings(true);
    }
  });

  const handleSaveSettings = (newConfig: ServerConfig) => {
    setConfig(newConfig);
    setShowSettings(false);
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
  };

  return (
    <box position="relative" flexDirection="column" flexGrow={1} padding={1}>
      <Header host={config.host} port={config.port} isConnected={isConnected} />
      <box flexDirection="row" gap={1} flexGrow={1}>
        <FunctionList functions={functions} />
        <WorkerList workers={workers} />
      </box>
      <StatusBar
        lastUpdated={lastUpdated}
        workerCount={workers.length}
        functionCount={functions.length}
        error={error}
      />
      {showSettings && (
        <Settings
          config={config}
          onSave={handleSaveSettings}
          onCancel={handleCancelSettings}
        />
      )}
    </box>
  );
}

export default App;
