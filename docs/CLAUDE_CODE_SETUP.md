# Claude Code Setup Guide

## Prerequisites

Before using Claude Code in your repository, you need to configure the required authentication token.

## Obtaining the CLAUDE_CODE_OAUTH_TOKEN

1. **Sign up for Claude Code**
   - Visit [Claude Code](https://claude.ai/code) and create an account if you haven't already
   - Navigate to your account settings or API section

2. **Generate an OAuth Token**
   - Look for the API or Developer settings section
   - Generate a new OAuth token with appropriate permissions for repository access
   - Copy the generated token (you won't be able to see it again)

## Configuring GitHub Secrets

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - In the left sidebar, expand "Secrets and variables"
   - Click on "Actions"

2. **Add the Secret**
   - Click "New repository secret"
   - Name: `CLAUDE_CODE_OAUTH_TOKEN`
   - Value: Paste your OAuth token from Claude Code
   - Click "Add secret"

## Verifying the Setup

After configuring the secret:

1. Create a test issue or PR comment mentioning `@claude`
2. Check the Actions tab to see if the workflow triggers
3. Monitor the workflow run for any authentication errors

## Usage Guidelines

### Triggering Claude Code

- **In Pull Requests**: Mention `@claude` in any comment
- **In Issues**: Mention `@claude` in any comment
- **Automatic Reviews**: Claude will automatically review new PRs (if claude-code-review.yml is enabled)

### Security Best Practices

1. **Token Permissions**: Only grant the minimum necessary permissions
2. **Token Rotation**: Regularly rotate your OAuth token for security
3. **Access Control**: Limit who can trigger the workflow by configuring branch protection rules
4. **Audit Logs**: Regularly review GitHub Actions logs for unauthorized usage

### Allowed Tools Configuration

You can customize which tools Claude can use by modifying the `allowed_tools` parameter in the workflow files:

```yaml
allowed_tools: Bash(npm install),Bash(npm run build),Bash(npm run lint),Bash(npm run test)
```

This restricts Claude to only execute the specified commands, enhancing security.

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret is correctly configured
   - Check if the token has expired
   - Ensure the token has the required permissions

2. **Workflow Not Triggering**
   - Confirm the workflow files are in `.github/workflows/`
   - Check if the user mentioning @claude has write access
   - Verify the workflow syntax is correct

3. **Rate Limiting**
   - Monitor API usage to avoid hitting rate limits
   - Consider implementing usage policies for your team

## Additional Resources

- [Claude Code Documentation](https://claude.ai/code)
- [Claude Code GitHub Action](https://github.com/anthropics/claude-code-action)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues specific to this repository's Claude Code setup, please open an issue in this repository.
For general Claude Code support, visit the official documentation or support channels.