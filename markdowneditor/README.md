# MarkdownEditor

Markdown Editor is a simple and web-based tool to create Markdown content created by Justin Verstijnen. This tool has the focus on creating articles for GitHub Pages with the Docsy Shortcodes built into it.

## Main features

The main features of this tool are:

- Creating Markdown Files
- Using the official Markdown-based content blocks with drag-and-drop
- Fast insertion of blocks with using "/" commands
- Fast application of blocks using "Enter" button
- Importing/Exporting Markdown files
- Reviewing/editing the Markdown files live
- Automatic images upload to Azure Blob Storage with Access Key and Entra ID authentication

## Hosting

This tool is currently hosted on GitHub Pages. Configuration changes are pushed and built using the default deployment method.

## Technical Architecture

- **Languages** : HTML, CSS, Javascript
- **Platform** : GitHub Pages
- **Runtime model** : Serverless
- **Dependencies** : None

## Changelog/new features

New features to this tool are added when needed or if the tool is broken.

Feature requests can be done by submitting issues into GitHub.

---

## Setup Azure Blob Storage

We can also paste clipboard images to Azure Blob Storage for easy blog writing. The authentication works with 2 mechanisms:

1. Storage Account Key (Easy but unsecure)
2. Microsoft Entra ID (Harder but more secure)

### 1. CORS

In the Storage Account, we must set CORS to this values:

| Allowed origins | Allowed Methods | Allowed headers | Exposed headers | Max age |
| --- | --- | --- | --- | --- |
| https://tools.justinverstijnen.nl | GETOPTIONSPUT | authorization,content-type,x-ms-* | x-ms-* | 3600 |

### 2. RBAC Roles

Assign the **Storage Blob Data Contributor** role at storage account level to the users which need to write to the containers

### 3. App registration

Create an App Registration for the editor and add the API permission Azure Storage -> User_impersonation. Then set the redirect URL.

---

## Issues

Its possible to submit any issues using the GitHub issues system.

At this moment, this tool has no known issues.

## License

This project is licensed under the **MIT license**. This means that the software is open source and can be used to run the tool yourself.

Use at your own risk. No guarantees or official support are provided.
