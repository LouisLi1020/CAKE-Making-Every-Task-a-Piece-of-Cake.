# Git Collaboration Guidelines

## Getting Started

### How to Fork and Contribute

1. **Fork the Repository**
   - Go to the main repository: `https://github.com/LouisLi1020/CAKE-Making-Every-Task-a-Piece-of-Cake`
   - Click the "Fork" button in the top-right corner
   - This creates a copy of the repository under your GitHub account

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CAKE-Making-Every-Task-a-Piece-of-Cake.git
   cd CAKE-Making-Every-Task-a-Piece-of-Cake
   ```

3. **Set Up Upstream Remote**
   ```bash
   git remote add upstream https://github.com/LouisLi1020/CAKE-Making-Every-Task-a-Piece-of-Cake.git
   ```

4. **Keep Your Fork Updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```

5. **Create a Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

6. **Make Your Changes and Commit**
   ```bash
   # Make your changes
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feat/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request" for your branch
   - Fill out the PR template
   - Submit the PR

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for writing commit messages.

### Basic Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Commit Prefixes (Headers)

| Prefix | Description | Example |
|--------|-------------|---------|
| `feat` | New feature | `feat: add user login functionality` |
| `fix` | Bug fix | `fix: correct typo in README` |
| `docs` | Documentation changes | `docs: update API usage in docs` |
| `style` | Formatting, missing semicolons, etc. (no logic change) | `style: fix indentation and spacing` |
| `refactor` | Code refactoring (neither new feature nor bug fix) | `refactor: simplify user auth logic` |
| `perf` | Performance improvements | `perf: improve image loading speed` |
| `test` | Adding or updating tests | `test: add unit tests for login module` |
| `chore` | Build process, tooling changes | `chore: update npm dependencies` |
| `build` | Build system changes | `build: update webpack config` |
| `ci` | CI configuration changes | `ci: add GitHub Actions workflow` |
| `revert` | Revert previous commit | `revert: revert "feat: add user login"` |

### Examples

#### Simple commits
```
feat: add user authentication system
fix: resolve CORS issue in API
docs: update README with setup instructions
```

#### Commits with scope
```
feat(auth): add JWT token validation
fix(api): handle null response in user endpoint
docs(client): add component usage examples
```

#### Detailed commits (with body)
```
feat: implement user registration

- Add user model with email and password validation
- Create registration endpoint with bcrypt hashing
- Add input validation and error handling
- Include unit tests for registration flow

Closes #123
```

## Branch Naming Convention

### Main Branches
- `main` - Production-ready code
- `develop` - Latest development features

### Feature Branches
- `feat/feature-name` - New feature development
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/component-name` - Code refactoring

### Examples
```
feat/user-authentication
fix/login-validation-error
docs/api-endpoints
refactor/task-component
```

## Pull Request Guidelines

### PR Title Format
```
<type>: <description>
```

### PR Description Template
```markdown
## Description
Brief description of the changes in this PR

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Local testing passed
- [ ] Unit tests passed
- [ ] Integration tests passed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Added necessary tests
- [ ] Updated relevant documentation
- [ ] Self-tested functionality works as expected

## Related Issues
Closes #123
```

## Workflow

### 1. Starting a New Feature
```bash
git checkout main
git pull origin main
git checkout -b feat/feature-name
```

### 2. During Development
```bash
# Commit changes regularly
git add .
git commit -m "feat: add user login form"

# Push to remote
git push origin feat/feature-name
```

### 3. Completing a Feature
```bash
# Ensure all tests pass
npm test

# Final commit
git commit -m "feat: complete user authentication system"
git push origin feat/feature-name
```

### 4. Creating a Pull Request
- Create PR on GitHub
- Use conventional title and description
- Request code review

## Best Practices

### ✅ Good Practices
- Use clear, descriptive commit messages
- Make atomic commits (one change per commit)
- Commit regularly, avoid large changes
- Test before committing
- Use appropriate prefixes

### ❌ Avoid
- Vague commit messages
- Committing too many changes at once
- Committing untested code
- Using inappropriate prefixes
- Committing sensitive information

## Tools and Setup

### Git Hooks
Consider setting up pre-commit hooks to:
- Validate commit message format
- Run linting
- Execute tests
- Check file sizes

### IDE Integration
- VS Code: Conventional Commits extension
- IntelliJ IDEA: Conventional Commit plugin
- GitLens: Enhanced Git functionality

### Recommended Extensions
- **VS Code**: 
  - Conventional Commits
  - GitLens
  - Git Graph
- **GitHub Desktop**: For visual Git management
- **SourceTree**: Advanced Git GUI

## Troubleshooting

### Common Issues

1. **Merge Conflicts**
   ```bash
   git status  # Check conflicted files
   # Resolve conflicts manually
   git add .
   git commit -m "fix: resolve merge conflicts"
   ```

2. **Accidental Commit to Main**
   ```bash
   git reset --soft HEAD~1  # Undo last commit
   git checkout -b feat/feature-name
   git add .
   git commit -m "feat: your feature"
   ```

3. **Wrong Branch**
   ```bash
   git stash  # Save current changes
   git checkout correct-branch
   git stash pop  # Apply saved changes
   ```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
