import { useState, useEffect, useCallback, useRef } from "react";
import { fetchGearmanStatus, type FunctionStatus, type Worker, type GearmanStatus } from "../lib/gearman";

interface UseGearmanOptions {
  host: string;
  port: number;
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseGearmanResult {
  functions: FunctionStatus[];
  workers: Worker[];
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useGearman({
  host,
  port,
  refreshInterval = 2000,
  enabled = true,
}: UseGearmanOptions): UseGearmanResult {
  const [status, setStatus] = useState<GearmanStatus>({ functions: [], workers: [] });
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchGearmanStatus(host, port);
      setStatus(data);
      setIsConnected(true);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [host, port]);

  useEffect(() => {
    if (!enabled) return;

    refresh();

    const interval = setInterval(refresh, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refresh, refreshInterval]);

  return {
    functions: status.functions,
    workers: status.workers,
    error,
    isConnected,
    lastUpdated,
    refresh,
  };
}
