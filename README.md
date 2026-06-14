# Curl Converter

A fast, clean, and efficient web-based tool to convert curl commands into code for 8+ programming languages. Built with a minimal developer-focused interface and deployed on Railway.

**Live Demo:** [https://curlconverter.railway.app](https://curlconverter.railway.app)  
**GitHub:** [https://github.com/DiwasKhatri07/curlconverter](https://github.com/DiwasKhatri07/curlconverter)  
**Support:** [Buy Me Coffee](https://buymecoffee.com/DiwasKhatri) | [Open Collective](https://opencollective.com/diwas)

---

## Overview

Curl Converter transforms HTTP requests captured as curl commands into clean, executable code in your language of choice. Whether you're working with APIs, testing endpoints, or migrating scripts, this tool eliminates the tedious manual conversion process.

The application features a distraction-free interface inspired by terminal aesthetics, with a clean white background, teal accents, and keyboard-first interactions designed for developer productivity.

---

## Features

### Supported Languages

The converter generates production-ready code for the following languages and frameworks:

| Language | Framework | Status |
|----------|-----------|--------|
| JavaScript | Fetch API | ✓ Supported |
| Python | Requests | ✓ Supported |
| Go | Standard Library | ✓ Supported |
| PHP | cURL | ✓ Supported |
| Node.js | Axios | ✓ Supported |
| HTTP | Raw HTTP | ✓ Supported |
| cURL | Command | ✓ Supported |
| JSON | Data Format | ✓ Supported |

### Supported curl Features

The parser recognizes and converts the following curl command options:

- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Headers**: Custom headers with `-H` or `--header`
- **Request Body**: JSON, form data, and raw data with `-d` or `--data`
- **Authentication**: Basic authentication with `-u` or `--user`
- **Cookies**: Cookie handling with `-b` or `--cookie`
- **SSL**: Insecure mode with `-k` or `--insecure`

### User Experience

- **Instant Conversion**: Real-time code generation as you paste curl commands
- **Keyboard Shortcuts**: Press `Ctrl+Enter` to convert, `Ctrl+C` to copy
- **One-Click Copy**: Copy generated code to clipboard with visual feedback
- **Download**: Save converted code as a file
- **Clean UI**: Minimal, distraction-free interface optimized for developer workflows
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

---

## Installation & Setup

### Prerequisites

- Node.js 18+ and pnpm
- Git
- A Railway account (for deployment)

### Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/DiwasKhatri07/curlconverter.git
cd curlconverter
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm run build
```

The optimized build output will be in the `dist/` directory.

---

## Technology Stack

The Curl Converter is built with modern web technologies:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend Framework | React 19 | UI component library |
| Styling | Tailwind CSS 4 | Utility-first CSS framework |
| UI Components | shadcn/ui | Pre-built accessible components |
| HTTP Client | Fetch API | Browser-native HTTP requests |
| State Management | React Hooks | Component state and effects |
| Routing | Wouter | Lightweight client-side routing |
| Notifications | Sonner | Toast notifications |
| Icons | Lucide React | SVG icon library |
| Build Tool | Vite | Fast frontend build tool |
| Package Manager | pnpm | Efficient Node.js package manager |

---

## Project Structure

```
curl-converter-app/
├── client/
│   ├── public/              # Static assets (favicon, robots.txt)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── lib/
│   │   │   └── curlParser.ts # Custom curl parsing logic
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles and design tokens
│   └── index.html           # HTML template
├── server/                  # Placeholder for future backend
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## Design Philosophy

The Curl Converter follows a **Minimal Developer Workspace** design approach:

### Core Principles

1. **Clarity First**: High contrast, readable typography, and clear visual hierarchy ensure developers can scan and understand information quickly.

2. **Speed Over Aesthetics**: Fast interactions, instant feedback, and no unnecessary animations prioritize productivity over decoration.

3. **Monospace Heritage**: The interface respects terminal aesthetics while making it web-friendly and accessible.

4. **Accessibility as Default**: WCAG AA compliance, keyboard navigation, and semantic HTML ensure the tool works for everyone.

### Color Palette

- **Primary (Teal)**: `#00d4ff` — Accent color for buttons, links, and highlights
- **Background**: `#ffffff` — Clean white for minimal visual noise
- **Foreground**: `#1a1a2e` — Deep slate for text and high contrast
- **Secondary**: `#f5f5f5` — Soft gray for subtle backgrounds
- **Borders**: `#e0e0e0` — Light gray for structure

### Typography

- **Display Font**: Courier Prime (monospace) — Headers and code blocks
- **Body Font**: Inter (sans-serif) — UI text and descriptions
- **Code Font**: Courier Prime (monospace) — Code blocks and examples

---

## Deployment

### Railway Deployment

The application is optimized for deployment on Railway. Follow these steps:

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Configure Environment**: Railway automatically detects the Node.js environment
3. **Deploy**: Push to the main branch to trigger automatic deployment
4. **Custom Domain**: Configure a custom domain in Railway settings

### Environment Variables

No environment variables are required for the static frontend deployment. The application runs entirely in the browser.

### Build Configuration

Railway automatically runs `pnpm run build` during deployment. The `dist/` directory contains the production-ready static files.

---

## Usage Examples

### Converting a Simple GET Request

**Input (curl):**
```bash
curl -X GET "https://api.example.com/users" -H "Authorization: Bearer token123"
```

**Output (JavaScript):**
```javascript
const response = await fetch(
  "https://api.example.com/users",
  {
    method: "GET",
    headers: {
      "Authorization": "Bearer token123",
    },
  }
);

const data = await response.json();
```

### Converting a POST Request with JSON Data

**Input (curl):**
```bash
curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

**Output (Python):**
```python
import requests

headers = {
    "Content-Type": "application/json",
}

data = '{"name":"John","email":"john@example.com"}'

response = requests.post(
    "https://api.example.com/users",
    headers=headers,
    data=data,
)
```

---

## Development

### Running Tests

Currently, the project includes manual testing. Automated tests can be added using Vitest:

```bash
pnpm run test
```

### Code Quality

Format code with Prettier:

```bash
pnpm run format
```

Check TypeScript:

```bash
pnpm run check
```

### Adding New Converters

To add support for a new language:

1. Create a new generator function in `client/src/lib/curlParser.ts`
2. Follow the pattern of existing generators (e.g., `generatePython`, `generateGo`)
3. Add the new converter to the `CONVERTERS` array in `client/src/pages/Home.tsx`
4. Test the conversion with sample curl commands

Example generator function:

```typescript
export function generateRust(parsed: ParsedCurl): string {
  const lines: string[] = [];
  
  lines.push("use reqwest::Client;");
  lines.push("");
  lines.push("#[tokio::main]");
  lines.push("async fn main() {");
  lines.push("    let client = Client::new();");
  lines.push(`    let res = client.${parsed.method.toLowerCase()}("${parsed.url}")`);
  
  // Add headers, data, auth as needed
  
  lines.push("        .send()");
  lines.push("        .await");
  lines.push("        .unwrap();");
  lines.push("}");
  
  return lines.join("\n");
}
```

---

## Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Create a Branch**: `git checkout -b feature/your-feature`
3. **Make Changes**: Implement your feature or fix
4. **Test**: Verify your changes work correctly
5. **Commit**: `git commit -m "Add your feature"`
6. **Push**: `git push origin feature/your-feature`
7. **Open a Pull Request**: Submit your changes for review

### Development Guidelines

- Follow the existing code style and patterns
- Write clear, descriptive commit messages
- Test your changes thoroughly before submitting
- Update documentation if you add new features
- Ensure your code passes TypeScript checks

---

## Troubleshooting

### Conversion Fails with "No URL found"

Ensure your curl command includes a valid URL. Example:

```bash
curl "https://api.example.com/endpoint"
```

### Headers Not Appearing in Output

Check that headers are properly formatted with `-H` or `--header`:

```bash
curl -H "Content-Type: application/json" "https://api.example.com"
```

### Authentication Not Working

For basic auth, use the `-u` or `--user` flag:

```bash
curl -u "username:password" "https://api.example.com"
```

---

## Performance

The Curl Converter is optimized for performance:

- **Client-Side Processing**: All conversion happens in the browser, no server round-trips
- **Minimal Bundle Size**: Optimized dependencies and tree-shaking reduce bundle size
- **Fast Parsing**: Efficient tokenization and parsing algorithms handle complex curl commands
- **Instant Feedback**: Real-time conversion with no debouncing or delays

---

## Browser Support

The application works on all modern browsers:

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## Credits & Attribution

**Built by:** [@diwazz](https://github.com/DiwasKhatri07)  
**Inspired by:** [curlconverter](https://github.com/curlconverter/curlconverter) — The original open-source curl conversion library

### Support the Project

If you find this tool useful, consider supporting its development:

- **Buy Me Coffee**: [https://buymecoffee.com/DiwasKhatri](https://buymecoffee.com/DiwasKhatri)
- **Open Collective**: [https://opencollective.com/diwas](https://opencollective.com/diwas)
- **Star on GitHub**: [https://github.com/DiwasKhatri07/curlconverter](https://github.com/DiwasKhatri07/curlconverter)

---

## Tags

`Nepal` `Open Source` `Developer Tool` `curl` `API` `Converter` `JavaScript` `Python` `Go` `PHP` `Node.js` `Web App`

---

## Changelog

### Version 1.0.0 (Initial Release)

- ✓ Support for 8 programming languages
- ✓ Clean, minimal UI with white-mode design
- ✓ Keyboard shortcuts (Ctrl+Enter to convert, Ctrl+C to copy)
- ✓ Download generated code as file
- ✓ Responsive design for all devices
- ✓ Railway deployment ready
- ✓ Full documentation and examples

---

## Roadmap

Future enhancements planned for Curl Converter:

- [ ] Support for additional languages (Ruby, Kotlin, Swift, Rust)
- [ ] Advanced curl features (multipart form data, file uploads)
- [ ] Dark mode theme option
- [ ] Command history and saved conversions
- [ ] Browser extension for quick conversions
- [ ] API endpoint for programmatic access
- [ ] Batch conversion support
- [ ] Custom code templates

---

## Contact & Support

For questions, suggestions, or bug reports:

- **GitHub Issues**: [https://github.com/DiwasKhatri07/curlconverter/issues](https://github.com/DiwasKhatri07/curlconverter/issues)
- **Email**: Contact via GitHub profile
- **Twitter/X**: [@diwazz](https://twitter.com/diwazz)

---

**Made with ❤️ by [@diwazz](https://github.com/DiwasKhatri07)**
