# Intune Naming Tool

Intune Naming Tool is a lightweight and web-based name generator created by Justin Verstijnen. This tool has the focus on creating consistent Microsoft Intune resource names and group names based on a fixed naming framework.

The tool helps you generate names using the following convention:

`Prefix-Type-Target-OS-Name/Goal`

Example:

`JV-CP-D-Win-OneDrive`

## Main features

The main features of this tool are:

- Generate names for Microsoft Intune resources
	- Configuration Profiles
	- Scripts
	- Windows Update Rings
	- Feature Updates
	- Driver Updates
	- Device Limit Restrictions
	- Device Platform Restrictions
	- Compliance Policies
	- Conditional Access
	- Device Clean-up Rules
	- Device Categories
	- Policy Sets
	- Windows Autopilot Deployment Profiles
	- Windows Autopilot Preparation Policies
	- Windows Autopilot Enrollment Status Pages
	- Enrollment Notifications
	- Windows 365 Provisioning Policies
	- Windows 365 Custom Images
	- Windows 365 Azure Network Connections
	- Endpoint Security policies
- Generate names for groups
	- Security Groups
	- Assigned Groups
	- Dynamic User Groups
	- Dynamic Device Groups
	- Microsoft 365 Groups
- Select the target type
	- Device
	- User
- Select the operating system or platform
	- Windows
	- Azure Virtual Desktop
	- Windows 365
	- Android
	- Linux
	- macOS
	- iOS / iPadOS
	- All OS
- Search through the naming framework catalog
- Shows the generated name live while typing
- Shows the separate name parts used to build the final name
- Cleans up input automatically
	- Spaces become hyphens
	- Special characters are removed
	- Prefix values are converted to uppercase
- Validate if all required fields are filled in
- Copy the generated name to the clipboard
- Shows recently generated names during the current browser session
- Export recently generated names to CSV
- Clear recently generated names
- Framework overview with clickable naming types

### What the tool doesn't do

- Create, change or delete anything in Microsoft Intune
- Connect to Microsoft Graph or Microsoft Intune APIs
- Authenticate users
- Store generated names on a server
- Cache, send or save the information in any way outside of the current browser session
- Enforce naming standards inside Microsoft Intune automatically

## Hosting

This tool is a static web application and can be hosted on GitHub Pages, Azure Static Web Apps or any other static website hosting platform.

No backend, database or server-side configuration is required. The tool runs fully in the browser.

## Technical Architecture

- **Languages** : HTML, CSS, Javascript
- **Platform** : Static web hosting
- **Runtime model** : Browser-based
- **Architecture** : Static frontend application
- **Dependencies** : No backend dependencies required
- **Data storage** : Current browser session only

## Changelog/new features

New features to this tool are added when needed or if the tool is broken.

Feature requests can be done by submitting issues into GitHub.

- UI refresh with visible tabs
- Added searchable Intune resource catalog
- Added searchable group catalog
- Added collapsible framework overview
- Added recently generated names overview
- Added CSV export for generated names
- Added clipboard copy functionality
- Added Azure Virtual Desktop as OS option
- Added Windows 365 as OS option

## Issues

Its possible to submit any issues using the GitHub issues system.

At this moment, this tool has no known issues.

## License

This project is licensed under the **MIT license**. This means that the software is open source and can be used to run the tool yourself.

Use at your own risk. No guarantees or official support are provided.
