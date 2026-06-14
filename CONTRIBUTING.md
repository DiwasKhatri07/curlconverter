# Contributing to Curl Converter

Thank you for your interest in contributing to Curl Converter! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We're building a welcoming community for developers of all levels.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (install with `npm install -g pnpm`)
- Git

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/curlconverter.git
   cd curlconverter
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/DiwasKhatri07/curlconverter.git
   ```

4. **Install Dependencies**
   ```bash
   pnpm install
   ```

5. **Start Development Server**
   ```bash
   pnpm run dev
   ```

## Making Changes

### Branch Naming

Use descriptive branch names following this pattern:
- `feature/add-rust-support` — New feature
- `fix/parser-bug` — Bug fix
- `docs/update-readme` — Documentation
- `refactor/optimize-parser` — Code refactoring

### Commit Messages

Write clear, descriptive commit messages:

```
Add support for Rust code generation

- Implement Rust generator function
- Add Rust to converter list
- Test with sample curl commands
```

### Code Style

- Follow the existing code patterns and style
- Use TypeScript for type safety
- Format code with Prettier: `pnpm run format`
- Check types with TypeScript: `pnpm run check`

### Testing

Test your changes thoroughly:

1. **Manual Testing**: Use the development server to test conversions
2. **Edge Cases**: Test with various curl command formats
3. **Browser Compatibility**: Test on different browsers

## Adding New Features

### Adding a New Language Converter

To add support for a new programming language:

1. **Create Generator Function**
   
   Add a new function to `client/src/lib/curlParser.ts`:
   
   ```typescript
   export function generateRuby(parsed: ParsedCurl): string {
     const lines: string[] = [];
     
     lines.push("require 'net/http'");
     lines.push("require 'uri'");
     lines.push("");
     lines.push("uri = URI('#{parsed.url}')");
     lines.push(`http = Net::HTTP.new(uri.host, uri.port)`);
     
     // Add implementation...
     
     return lines.join("\n");
   }
   ```

2. **Register the Converter**
   
   Add to the `CONVERTERS` array in `client/src/pages/Home.tsx`:
   
   ```typescript
   { label: "Ruby", value: "ruby", fn: generateRuby }
   ```

3. **Test the Converter**
   
   - Paste a curl command in the UI
   - Select your new language
   - Click "Convert"
   - Verify the output is valid and executable

4. **Update Documentation**
   
   Add your language to the supported languages table in `README.md`

### Improving the Parser

To enhance curl parsing capabilities:

1. **Identify Missing Feature**: Document which curl options aren't supported
2. **Update Parser**: Add parsing logic to `parseCurl()` function
3. **Update Generators**: Ensure all generators handle the new feature
4. **Test**: Verify with various curl commands

## Submitting Changes

### Before Submitting

1. **Sync with Upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Quality Checks**
   ```bash
   pnpm run check    # TypeScript
   pnpm run format   # Prettier
   ```

3. **Test Thoroughly**
   - Test in development: `pnpm run dev`
   - Test production build: `pnpm run build && pnpm run preview`

### Create Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin your-branch-name
   ```

2. **Open Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Compare your fork with the main repository
   - Write a clear description of your changes

3. **PR Description Template**
   ```markdown
   ## Description
   Brief description of what this PR does.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Testing
   Describe how you tested your changes.

   ## Checklist
   - [ ] Code follows project style
   - [ ] TypeScript checks pass
   - [ ] Changes tested locally
   - [ ] Documentation updated
   ```

## Review Process

1. **Code Review**: Maintainers will review your code
2. **Feedback**: Address any requested changes
3. **Approval**: Once approved, your PR will be merged
4. **Release**: Your changes will be included in the next release

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/
│   │   └── curlParser.ts # Parser and generators
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── index.html

server/                   # Backend (future)
```

## Common Tasks

### Running the Development Server

```bash
pnpm run dev
```

Access at `http://localhost:3000`

### Building for Production

```bash
pnpm run build
```

Output in `dist/` directory

### Formatting Code

```bash
pnpm run format
```

### Type Checking

```bash
pnpm run check
```

## Reporting Issues

Found a bug? Have a suggestion? Open an issue:

1. **Check Existing Issues**: Avoid duplicates
2. **Describe the Problem**: Be specific and clear
3. **Provide Examples**: Include curl commands that demonstrate the issue
4. **Expected vs Actual**: Explain what should happen vs what actually happens

## Documentation

Help improve documentation:

- Fix typos and grammar
- Clarify confusing sections
- Add examples
- Update outdated information
- Translate documentation

## Recognition

Contributors are recognized in:

- GitHub repository contributors list
- Project README
- Release notes

## Questions?

- **GitHub Discussions**: Ask questions in GitHub Discussions
- **Issues**: Open an issue with your question
- **Twitter**: [@diwazz](https://twitter.com/diwazz)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Curl Converter! 🎉
