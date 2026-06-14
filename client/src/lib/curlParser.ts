/**
 * Curl Parser - Extracts HTTP request information from curl commands
 * Inspired by curlconverter but simplified for browser use
 */

export interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  data: string | null;
  auth: { username: string; password: string } | null;
  cookies: Record<string, string>;
  insecure: boolean;
}

/**
 * Parse a curl command string and extract HTTP request details
 */
export function parseCurl(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    method: "GET",
    url: "",
    headers: {},
    data: null,
    auth: null,
    cookies: {},
    insecure: false,
  };

  // Remove leading/trailing whitespace
  let cmd = curlCommand.trim();

  // Remove 'curl' from the beginning
  if (cmd.startsWith("curl")) {
    cmd = cmd.substring(4).trim();
  }

  // Tokenize the command, respecting quotes
  const tokens = tokenize(cmd);

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    // URL (doesn't start with -)
    if (!token.startsWith("-")) {
      result.url = token;
      i++;
      continue;
    }

    // Method
    if (token === "-X" || token === "--request") {
      i++;
      if (i < tokens.length) {
        result.method = tokens[i].toUpperCase();
      }
      i++;
      continue;
    }

    // Headers
    if (token === "-H" || token === "--header") {
      i++;
      if (i < tokens.length) {
        const header = tokens[i];
        const colonIndex = header.indexOf(":");
        if (colonIndex > -1) {
          const key = header.substring(0, colonIndex).trim();
          const value = header.substring(colonIndex + 1).trim();
          result.headers[key] = value;
        }
      }
      i++;
      continue;
    }

    // Data
    if (token === "-d" || token === "--data" || token === "--data-raw") {
      i++;
      if (i < tokens.length) {
        result.data = tokens[i];
        // Auto-detect POST if data is provided
        if (result.method === "GET") {
          result.method = "POST";
        }
      }
      i++;
      continue;
    }

    // Form data
    if (token === "-F" || token === "--form") {
      i++;
      if (i < tokens.length) {
        result.data = tokens[i];
        if (result.method === "GET") {
          result.method = "POST";
        }
      }
      i++;
      continue;
    }

    // Authentication
    if (token === "-u" || token === "--user") {
      i++;
      if (i < tokens.length) {
        const auth = tokens[i];
        const colonIndex = auth.indexOf(":");
        if (colonIndex > -1) {
          result.auth = {
            username: auth.substring(0, colonIndex),
            password: auth.substring(colonIndex + 1),
          };
        } else {
          result.auth = {
            username: auth,
            password: "",
          };
        }
      }
      i++;
      continue;
    }

    // Cookies
    if (token === "-b" || token === "--cookie") {
      i++;
      if (i < tokens.length) {
        const cookieStr = tokens[i];
        const parts = cookieStr.split(";");
        parts.forEach((part) => {
          const [key, value] = part.split("=").map((s) => s.trim());
          if (key && value) {
            result.cookies[key] = value;
          }
        });
      }
      i++;
      continue;
    }

    // Insecure (ignore SSL verification)
    if (token === "-k" || token === "--insecure") {
      result.insecure = true;
      i++;
      continue;
    }

    // Skip unknown options
    i++;
  }

  return result;
}

/**
 * Tokenize curl command, respecting quoted strings
 */
function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let i = 0;

  while (i < cmd.length) {
    const char = cmd[i];
    const nextChar = cmd[i + 1];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      i++;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      i++;
      continue;
    }

    if (char === "\\" && (inSingleQuote || inDoubleQuote)) {
      // Handle escape sequences
      if (nextChar) {
        current += nextChar;
        i += 2;
        continue;
      }
    }

    if (char === " " && !inSingleQuote && !inDoubleQuote) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      i++;
      continue;
    }

    current += char;
    i++;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Generate JavaScript (Fetch) code from parsed curl
 */
export function generateJavaScript(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push("const response = await fetch(");
  lines.push(`  "${parsed.url}",`);
  lines.push("  {");
  lines.push(`    method: "${parsed.method}",`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push("    headers: {");
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`      "${key}": "${value}",`);
    });
    lines.push("    },");
  }

  if (parsed.data) {
    lines.push(`    body: ${JSON.stringify(parsed.data)},`);
  }

  if (parsed.auth) {
    const encoded = btoa(`${parsed.auth.username}:${parsed.auth.password}`);
    lines.push(`    headers: { Authorization: "Basic ${encoded}" },`);
  }

  lines.push("  }");
  lines.push(");");
  lines.push("");
  lines.push("const data = await response.json();");

  return lines.join("\n");
}

/**
 * Generate Python code from parsed curl
 */
export function generatePython(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push("import requests");
  lines.push("");

  const params: string[] = [];
  params.push(`"${parsed.url}"`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push("headers = {");
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`    "${key}": "${value}",`);
    });
    lines.push("}");
    lines.push("");
    params.push("headers=headers");
  }

  if (parsed.data) {
    lines.push(`data = ${JSON.stringify(parsed.data)}`);
    lines.push("");
    params.push("data=data");
  }

  if (parsed.auth) {
    params.push(`auth=("${parsed.auth.username}", "${parsed.auth.password}")`);
  }

  const methodLower = parsed.method.toLowerCase();
  lines.push(`response = requests.${methodLower}(`);
  lines.push(`    ${params.join(",\n    ")}`);
  lines.push(")");

  return lines.join("\n");
}

/**
 * Generate Go code from parsed curl
 */
export function generateGo(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push("package main");
  lines.push("");
  lines.push("import (");
  lines.push('    "fmt"');
  lines.push('    "io"');
  lines.push('    "net/http"');
  lines.push('    "strings"');
  lines.push(")");
  lines.push("");
  lines.push("func main() {");

  if (parsed.data) {
    lines.push(`    payload := strings.NewReader(${JSON.stringify(parsed.data)})`);
  }

  lines.push(`    req, _ := http.NewRequest("${parsed.method}", "${parsed.url}", ${parsed.data ? "payload" : "nil"})`);

  Object.entries(parsed.headers).forEach(([key, value]) => {
    lines.push(`    req.Header.Add("${key}", "${value}")`);
  });

  if (parsed.auth) {
    lines.push(`    req.SetBasicAuth("${parsed.auth.username}", "${parsed.auth.password}")`);
  }

  lines.push("");
  lines.push("    res, _ := http.DefaultClient.Do(req)");
  lines.push("    defer res.Body.Close()");
  lines.push("    body, _ := io.ReadAll(res.Body)");
  lines.push('    fmt.Println(string(body))');
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate cURL (HTTP format) from parsed curl
 */
export function generateHTTP(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push(`${parsed.method} ${new URL(parsed.url).pathname} HTTP/1.1`);
  lines.push(`Host: ${new URL(parsed.url).hostname}`);

  Object.entries(parsed.headers).forEach(([key, value]) => {
    lines.push(`${key}: ${value}`);
  });

  if (parsed.auth) {
    const encoded = btoa(`${parsed.auth.username}:${parsed.auth.password}`);
    lines.push(`Authorization: Basic ${encoded}`);
  }

  lines.push("Connection: close");
  lines.push("");

  if (parsed.data) {
    lines.push(parsed.data);
  }

  return lines.join("\n");
}

/**
 * Generate cURL command from parsed curl
 */
export function generateCurl(parsed: ParsedCurl): string {
  const parts: string[] = ["curl"];

  if (parsed.method !== "GET") {
    parts.push(`-X ${parsed.method}`);
  }

  Object.entries(parsed.headers).forEach(([key, value]) => {
    parts.push(`-H "${key}: ${value}"`);
  });

  if (parsed.data) {
    parts.push(`-d '${parsed.data}'`);
  }

  if (parsed.auth) {
    parts.push(`-u "${parsed.auth.username}:${parsed.auth.password}"`);
  }

  if (parsed.insecure) {
    parts.push("-k");
  }

  parts.push(`"${parsed.url}"`);

  return parts.join(" ");
}

/**
 * Generate JSON representation
 */
export function generateJSON(parsed: ParsedCurl): string {
  return JSON.stringify(parsed, null, 2);
}

/**
 * Generate PHP code from parsed curl
 */
export function generatePHP(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push("<?php");
  lines.push("");
  lines.push("$curl = curl_init();");
  lines.push("");
  lines.push("curl_setopt_array($curl, array(");
  lines.push(`    CURLOPT_URL => "${parsed.url}",`);
  lines.push(`    CURLOPT_RETURNTRANSFER => true,`);
  lines.push(`    CURLOPT_CUSTOMREQUEST => "${parsed.method}",`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push("    CURLOPT_HTTPHEADER => array(");
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`        "${key}: ${value}",`);
    });
    lines.push("    ),");
  }

  if (parsed.data) {
    lines.push(`    CURLOPT_POSTFIELDS => ${JSON.stringify(parsed.data)},`);
  }

  if (parsed.auth) {
    lines.push(`    CURLOPT_USERPWD => "${parsed.auth.username}:${parsed.auth.password}",`);
  }

  lines.push("));");
  lines.push("");
  lines.push("$response = curl_exec($curl);");
  lines.push("curl_close($curl);");
  lines.push("");
  lines.push("echo $response;");
  lines.push("?>");

  return lines.join("\n");
}

/**
 * Generate Node.js (Axios) code from parsed curl
 */
export function generateNodeAxios(parsed: ParsedCurl): string {
  const lines: string[] = [];

  lines.push("const axios = require('axios');");
  lines.push("");
  lines.push("const config = {");
  lines.push(`    method: '${parsed.method.toLowerCase()}',`);
  lines.push(`    url: '${parsed.url}',`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push("    headers: {");
    Object.entries(parsed.headers).forEach(([key, value]) => {
      lines.push(`        '${key}': '${value}',`);
    });
    lines.push("    },");
  }

  if (parsed.data) {
    lines.push(`    data: ${JSON.stringify(parsed.data)},`);
  }

  if (parsed.auth) {
    lines.push(`    auth: {`);
    lines.push(`        username: '${parsed.auth.username}',`);
    lines.push(`        password: '${parsed.auth.password}',`);
    lines.push(`    },`);
  }

  lines.push("};");
  lines.push("");
  lines.push("axios(config)");
  lines.push("    .then(response => console.log(response.data))");
  lines.push("    .catch(error => console.error(error));");

  return lines.join("\n");
}
