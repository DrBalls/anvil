# Claude Code Guidelines

This document provides coding standards and guidelines for Claude when working on this repository.

## Code Style Guidelines

### General Principles
- Follow existing code patterns and conventions in the repository
- Maintain consistency with surrounding code
- Prioritize readability and maintainability
- Write self-documenting code with clear variable and function names

### Language-Specific Standards

#### JavaScript/TypeScript
- Use ES6+ features where appropriate
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises when possible
- Follow existing indentation (spaces vs tabs)
- Use meaningful variable names (avoid single letters except for loop counters)

#### Python
- Follow PEP 8 style guide
- Use type hints where applicable
- Prefer f-strings for string formatting
- Keep functions small and focused

### Comments and Documentation
- Write clear, concise comments for complex logic
- Update existing comments when changing code
- Use JSDoc or appropriate documentation format for functions
- Avoid obvious comments that don't add value

## Testing Requirements

### Before Committing
- Run existing test suites if available
- Ensure no tests are broken by changes
- Add tests for new functionality when feasible
- Check for linting errors

### Test Commands
```bash
# Add project-specific test commands here
# npm test
# npm run lint
# python -m pytest
```

## Git Commit Guidelines

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb in present tense (Add, Fix, Update, Remove)
- Keep the first line under 50 characters
- Add detailed description if needed after a blank line

### Examples
```
Add user authentication middleware

- Implement JWT token validation
- Add user session management
- Update API routes to use auth middleware
```

## Security Considerations

### Never Commit
- API keys, tokens, or credentials
- Personal information or sensitive data
- Large binary files
- Generated files that should be gitignored

### Always Check
- Input validation and sanitization
- SQL injection vulnerabilities
- XSS vulnerabilities in web applications
- Proper error handling without exposing internals

## Code Review Checklist

When reviewing code, Claude should check for:

1. **Functionality**
   - Does the code do what it's supposed to do?
   - Are edge cases handled?
   - Is error handling appropriate?

2. **Performance**
   - Are there any obvious performance issues?
   - Is the algorithm efficient for the use case?
   - Are database queries optimized?

3. **Security**
   - Are inputs validated?
   - Are there any security vulnerabilities?
   - Is sensitive data properly protected?

4. **Maintainability**
   - Is the code easy to understand?
   - Is it properly documented?
   - Does it follow DRY principles?

5. **Testing**
   - Are there adequate tests?
   - Do tests cover edge cases?
   - Are tests maintainable?

## Working with Claude

### Best Practices
- Be specific in your requests
- Provide context about the problem you're solving
- Mention if you have specific requirements or constraints
- Let Claude know about any relevant project conventions

### What Claude Can Help With
- Bug fixes and debugging
- Code refactoring
- Adding new features
- Writing tests
- Code reviews
- Documentation updates
- Performance optimization
- Security improvements

### Limitations
- Cannot approve PRs (for security reasons)
- Cannot modify workflow files in `.github/workflows/`
- Cannot access external services without proper configuration
- Works within the context of the current repository

## Project-Specific Guidelines

<!-- Add any project-specific guidelines here -->

### Dependencies
- Check `package.json`, `requirements.txt`, or equivalent before adding new dependencies
- Use existing libraries where possible
- Document why new dependencies are needed

### File Organization
- Follow the existing project structure
- Place new files in appropriate directories
- Keep related functionality grouped together

## Feedback and Improvements

This document is a living guide. If you notice areas for improvement or have suggestions for additional guidelines, please contribute by updating this file or discussing in issues.