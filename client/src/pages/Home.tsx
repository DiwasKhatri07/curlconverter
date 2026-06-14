/**
 * Curl Converter - Home Page
 * Design: Minimal Developer Workspace
 * - Clean white background with teal accents
 * - Asymmetric layout: input left, output right
 * - Monospace typography for code blocks
 * - Instant feedback and keyboard-first interactions
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Download, ExternalLink } from "lucide-react";
import {
  parseCurl,
  generateJavaScript,
  generatePython,
  generateGo,
  generateHTTP,
  generateCurl,
  generateJSON,
  generatePHP,
  generateNodeAxios,
} from "@/lib/curlParser";

// List of available converters
const CONVERTERS = [
  { label: "JavaScript (Fetch)", value: "javascript", fn: generateJavaScript },
  { label: "Python (Requests)", value: "python", fn: generatePython },
  { label: "Go", value: "go", fn: generateGo },
  { label: "PHP (cURL)", value: "php", fn: generatePHP },
  { label: "Node.js (Axios)", value: "node-axios", fn: generateNodeAxios },
  { label: "HTTP", value: "http", fn: generateHTTP },
  { label: "cURL", value: "curl", fn: generateCurl },
  { label: "JSON", value: "json", fn: generateJSON },
];

export default function Home() {
  const [curlInput, setCurlInput] = useState(
    'curl -X GET "https://api.example.com/users" -H "Authorization: Bearer token123"'
  );
  const [selectedConverter, setSelectedConverter] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert curl to selected language
  const handleConvert = async () => {
    if (!curlInput.trim()) {
      setError("Please paste a curl command");
      toast.error("Curl command is required");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const converter = CONVERTERS.find((c) => c.value === selectedConverter);
      if (!converter) {
        throw new Error("Converter not found");
      }

      const parsed = parseCurl(curlInput);
      if (!parsed.url) {
        throw new Error("No URL found in curl command");
      }

      const result = converter.fn(parsed);
      setOutput(result);
      toast.success("Conversion successful!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Conversion failed";
      setError(errorMsg);
      toast.error(errorMsg);
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  // Copy output to clipboard
  const handleCopy = async () => {
    if (!output) {
      toast.error("No output to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  // Download output as file
  const handleDownload = () => {
    if (!output) {
      toast.error("No output to download");
      return;
    }

    const ext = selectedConverter === "json" ? "json" : "txt";
    const filename = `converted.${ext}`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded as ${filename}`);
  };

  // Clear all
  const handleClear = () => {
    setCurlInput("");
    setOutput("");
    setError("");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter to convert
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleConvert();
      }
      // Ctrl+C or Cmd+C to copy (when output is focused)
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && output && document.activeElement?.id === "output") {
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [output, curlInput, selectedConverter]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
              &lt;&gt;
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Curl Converter</h1>
              <p className="text-xs text-muted-foreground">Convert curl to 8+ languages</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="https://github.com/DiwasKhatri07/curlconverter"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded transition-colors"
            >
              <ExternalLink className="w-4 h-4 inline mr-1" />
              GitHub
            </a>
            <a
              href="https://buymecoffee.com/DiwasKhatri"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded transition-colors"
            >
              ☕ Buy Me Coffee
            </a>
          </nav>
        </div>
      </header>

      {/* Fork Me Button */}
      <a
        href="https://github.com/DiwasKhatri07/curlconverter"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-20 right-0 z-40 bg-primary text-white px-4 py-2 rounded-l-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg"
      >
        🍴 Fork Me
      </a>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Paste your curl command
              </label>
              <Textarea
                value={curlInput}
                onChange={(e) => setCurlInput(e.target.value)}
                placeholder="curl -X GET 'https://api.example.com/users' -H 'Authorization: Bearer token'"
                className="font-mono text-sm h-64 resize-none border-border focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Press Ctrl+Enter to convert
              </p>
            </div>

            {/* Converter Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Convert to
              </label>
              <Select value={selectedConverter} onValueChange={setSelectedConverter}>
                <SelectTrigger className="border-border focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {CONVERTERS.map((converter) => (
                    <SelectItem key={converter.value} value={converter.value}>
                      {converter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleConvert}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert"
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="px-4 border-border hover:bg-secondary"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Generated code
              </label>
              <div className="relative">
                <pre
                  id="output"
                  className="bg-secondary border border-border rounded-md p-4 h-64 overflow-auto text-sm text-foreground font-mono"
                >
                  {output || (
                    <span className="text-muted-foreground">
                      {error ? `Error: ${error}` : "Your converted code will appear here..."}
                    </span>
                  )}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Press Ctrl+C to copy
              </p>
            </div>

            {/* Output Actions */}
            {output && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="px-4 border-border hover:bg-secondary"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 py-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-bold text-foreground mb-2">8+ Languages</h3>
              <p className="text-sm text-muted-foreground">
                Convert curl to JavaScript, Python, Go, PHP, Node.js, and more.
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-bold text-foreground mb-2">Instant Conversion</h3>
              <p className="text-sm text-muted-foreground">
                Real-time conversion with keyboard shortcuts for maximum efficiency.
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <h3 className="font-bold text-foreground mb-2">One-Click Copy</h3>
              <p className="text-sm text-muted-foreground">
                Copy converted code to clipboard instantly. Download as file too.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Features */}
        <div className="mt-12 py-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Supported Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-foreground">HTTP Methods</h4>
                <p className="text-sm text-muted-foreground">GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-foreground">Headers</h4>
                <p className="text-sm text-muted-foreground">Custom headers with -H or --header</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-foreground">Request Body</h4>
                <p className="text-sm text-muted-foreground">JSON, form data, and raw data with -d</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold text-foreground">Authentication</h4>
                <p className="text-sm text-muted-foreground">Basic auth with -u or --user</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">About</h4>
              <p className="text-sm text-muted-foreground">
                A fast, clean curl-to-code converter for developers. Built with ❤️ by{" "}
                <a
                  href="https://github.com/DiwasKhatri07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  @diwazz
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/DiwasKhatri07/curlconverter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://opencollective.com/diwas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open Collective
                  </a>
                </li>
                <li>
                  <a
                    href="https://buymecoffee.com/DiwasKhatri"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Buy Me Coffee
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                  Nepal
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                  Open Source
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                  Developer Tool
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              © 2026 Curl Converter. Made with 💙 by{" "}
              <a
                href="https://github.com/DiwasKhatri07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                @diwazz
              </a>
              . Licensed under MIT.
            </p>
            <p className="mt-2">
              Inspired by the open-source{" "}
              <a
                href="https://github.com/curlconverter/curlconverter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                curlconverter
              </a>{" "}
              project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
