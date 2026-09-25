# Security Policy

## Reporting

Please do not open public issues for suspected security vulnerabilities.

Report them privately to the repository owner through GitHub and include the affected component, reproduction steps, and likely impact.

## Secrets

Never commit production credentials, WordPress configuration, private keys, customer data, or local environment files.

The repository `.gitignore` intentionally excludes sensitive files such as:

- `wp-config.php`
- `.env*`
- private key material
- local admin credential files

Use placeholders in examples and environment-specific secret stores in production.

## Supported code

Security fixes target the current `main` branch.
