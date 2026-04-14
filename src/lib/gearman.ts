import { connect } from "net";

export interface FunctionStatus {
  name: string;
  total: number;
  running: number;
  availableWorkers: number;
}

export interface Worker {
  fd: string;
  ip: string;
  clientId: string;
  functions: string[];
}

export interface GearmanStatus {
  functions: FunctionStatus[];
  workers: Worker[];
}

function parseStatusResponse(data: string): FunctionStatus[] {
  const lines = data.split("\n").filter((line) => line.trim() !== "" && line !== ".");
  
  return lines.map((line) => {
    const parts = line.split("\t");
    return {
      name: parts[0] ?? "",
      total: parseInt(parts[1] ?? "", 10) || 0,
      running: parseInt(parts[2] ?? "", 10) || 0,
      availableWorkers: parseInt(parts[3] ?? "", 10) || 0,
    };
  });
}

function parseWorkersResponse(data: string): Worker[] {
  const lines = data.split("\n").filter((line) => line.trim() !== "" && line !== ".");
  
  return lines.map((line) => {
    const colonIndex = line.indexOf(" :");
    if (colonIndex === -1) {
      return {
        fd: line.trim(),
        ip: "",
        clientId: "",
        functions: [],
      };
    }

    const workerInfo = line.substring(0, colonIndex);
    const functionsPart = line.substring(colonIndex + 3);

    const workerParts = workerInfo.split(" ");
    const fd = workerParts[0] ?? "";
    const ip = workerParts[1] ?? "";
    const clientId = workerParts.slice(2).join(" ").trim() ?? "";

    const functions = functionsPart
      .split(" ")
      .filter((f) => f.trim() !== "");

    return {
      fd,
      ip,
      clientId,
      functions,
    };
  });
}

export async function fetchGearmanStatus(
  host: string,
  port: number
): Promise<GearmanStatus> {
  return new Promise((resolve, reject) => {
    let statusData = "";
    let workersData = "";
    let receivedStatus = false;
    let receivedWorkers = false;

    const client = connect(port, host, () => {
      client.write("status\n");
    });

    client.on("data", (chunk: Buffer) => {
      const str = chunk.toString();
      
      if (!receivedStatus) {
        const statusEnd = str.indexOf(".\n");
        if (statusEnd !== -1) {
          statusData += str.substring(0, statusEnd);
          receivedStatus = true;
          
          client.write("workers\n");
          
          const remaining = str.substring(statusEnd + 2);
          if (remaining.includes(".")) {
            workersData += remaining.split(".")[0] ?? "";
            receivedWorkers = true;
            client.end();
          } else {
            workersData += remaining;
          }
        } else {
          statusData += str;
        }
      } else if (!receivedWorkers) {
        if (str.includes(".")) {
          workersData += str.split(".")[0] ?? "";
          receivedWorkers = true;
          client.end();
        } else {
          workersData += str;
        }
      }
    });

    client.on("error", (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });

    client.on("close", () => {
      if (receivedStatus && receivedWorkers) {
        resolve({
          functions: parseStatusResponse(statusData),
          workers: parseWorkersResponse(workersData),
        });
      } else if (receivedStatus && !receivedWorkers) {
        reject(new Error("Incomplete response: workers command not received"));
      } else {
        reject(new Error("Incomplete response from Gearman server"));
      }
    });

    setTimeout(() => {
      client.destroy();
      reject(new Error("Connection timeout"));
    }, 5000);
  });
}
