# Contributing to Markpad

Thank you for your interest in contributing to Markpad!

## Code of Conduct

We expect all contributors to follow these guidelines:

- Treat others with respect and kindness
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

If you find a bug, please:

1. Check [Issues](https://github.com/yourusername/markpad/issues) to ensure it hasn't been reported
2. Create a new Issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment information (OS, version, etc.)

### Suggesting Features

1. Discuss your idea in Issues first
2. Explain the purpose and value of the feature
3. Provide possible implementation approaches (if any)

### Submitting Code

#### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/markpad.git
   cd markpad
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Develop and test**
   ```bash
   npm run electron:dev
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: fix某个bug"
   ```

6. **Push to your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Visit the project page on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR description

#### Commit Message Convention

Use the following format:

```
<type>: <subject>

<body>

<footer>
```

**Type**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting (no functional change)
- `refactor`: Code refactoring
- `test`: Testing related
- `chore`: Build process or auxiliary tool changes

**Example**:
```
feat: add search functionality

Implement full-text search across all open documents.
Includes UI components and keyboard shortcut Ctrl+F.

Closes #123
```

#### Code Standards

- Use ESLint and Prettier
- Run `npm run lint` to check code
- Follow Vue 3 Style Guide
- Use Composition API and `<script setup>`
- Add comments for complex features
- Keep functions concise (single responsibility)

#### Testing

While there are no automated tests currently, please ensure:

- New features work properly
- Existing features are not broken
- Test on different operating systems (if possible)
- Test display in light and dark themes

### Documentation Contributions

- Fix documentation errors
- Improve instructions and examples
- Add translations
- Update screenshots

## Pull Request Review Process

1. After submitting a PR, maintainers will review it
2. Changes may be requested
3. Once approved, it will be merged
4. Your contribution will be recorded in the CHANGELOG

## Development Environment Setup

### Required Tools

- Node.js 16.x or higher
- npm or yarn
- Git

### Recommended Tools

- VS Code
- Vue Language Features (Volar)
- ESLint extension
- Prettier extension

### Project Structure

```
markpad/
├── electron/          # Electron main process
├── src/              # Vue application source
│   ├── components/   # Vue components
│   ├── views/        # Views
│   ├── store/        # State management
│   ├── utils/        # Utility functions
│   └── styles/       # Style files
├── public/           # Static resources
└── docs/            # Documentation
```

## Getting Help

If you have any questions:

- Check [DEVELOPMENT.md](DEVELOPMENT.md)
- Ask in Issues
- Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you again for your contribution! 🎉
