# Contributing to DesiLearCode

We welcome contributions from engineers, educators, and open-source advocates.

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Verify tests locally before committing:
   ```bash
   npm test
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
5. Submit a pull request targeting `main`.

## Coding Standards

- **TypeScript**: Strict type checking with 0 compiler errors.
- **Child Safeguarding**: Never store or display minor student personal data.
- **Security**: Never commit secrets or API keys.
