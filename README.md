# @mbakgun/n8n-nodes-slack-socket-mode

<div align="center">
  <img src="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png" width="200" alt="n8n logo">
  <h3>+</h3>
  <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" width="100" alt="Slack logo">
</div>

This is an n8n community node that lets you use Slack Socket Mode in your n8n workflows. It enables real-time event processing from Slack without requiring public URLs for webhooks.

Since the current integration of Slack in n8n only supports webhooks, this node allows you to use the Slack Socket Mode to listen to events in your Slack workspace in real-time, even in local development environments.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents
- [Installation](#installation)
- [Slack App Setup](#slack-app-setup)
- [Credentials](#credentials)
- [Node Configuration](#node-configuration)
- [Supported Events](#supported-events)
- [Usage Examples](#usage-examples)
- [Example Workflow](#example-workflow)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Using Bun (recommended):
```bash
bun add @mbakgun/n8n-nodes-slack-socket-mode
```

Using npm:
```bash
npm install @mbakgun/n8n-nodes-slack-socket-mode
```

After installation, restart n8n and the node will be available in the nodes panel.

### Development Setup

This project uses [Bun](https://bun.sh) as its package manager. To set up your development environment:

1. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
   
2. Install dependencies:
   ```bash
   bun install
   ```
   
3. Build the project:
   ```bash
   bun run build
   ```

## Slack App Setup

Before using this node, you need to create a Slack app with Socket Mode enabled:

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and create a new app
2. Navigate to "Socket Mode" in the left sidebar and enable it
3. Generate an 'App-Level Token' with the `connections:write` scope
4. Go to "OAuth & Permissions" and add the following Bot Token Scopes:
   - `app_mentions:read`
   - `channels:history`
   - `channels:read`
   - `chat:write`
   - `reactions:read`
   - `team:read`
   - (Add any other scopes required for your use case)
5. Install the app to your workspace (This will generate a 'Bot User OAuth Token')
6. Copy the Bot User OAuth Token, App-Level Token, and Signing Secret(from the 'Basic Information' section) for credential setup
7. Go to 'Event Subscriptions' and enable 'Socket Mode'
8. Subscribe to the events you want to listen to (e.g. `app_mention`, `message`, `reaction_removed`, `reaction_added`)

## Credentials

To use this node, you need to set up credentials with the following information:

- **Bot Token**: Your Slack Bot User OAuth Token (starts with `xoxb-`)
- **App-Level Token**: Your Slack App-Level Token for Socket Mode (starts with `xapp-`)
- **Signing Secret**: Your Slack App Signing Secret

These values can be found in your Slack App configuration.

## Node Configuration

The Slack Socket Trigger node can be configured with the following options:

- **Trigger On**: Select which Slack events should trigger your workflow:
  - Bot / App Mention
  - Button Interaction
  - New Message Posted to Channel
  - New Public Channel Created
  - New User
  - Reaction Added
  - Reaction Removed

- **Regex Pattern**: Optional regular expression to match against incoming Slack messages
- **Regex Flags**: Flags for the regular expression (e.g., `g` for global, `i` for case-insensitive)

## Supported Events

The node currently supports the following Slack events:

- `app_mention`: When your bot is mentioned in a channel
- `block_actions`: When a user interacts with buttons, including NPS-style ratings
- `message`: When a message is posted to a channel the app is added to
- `channel_created`: When a new public channel is created
- `team_join`: When a new user is added to Slack
- `reaction_added`: When a reaction is added to a message
- `reaction_removed`: When a reaction is removed from a message

## Usage Examples

### Respond to mentions

Configure the node to trigger on `app_mention` events to make your workflow respond when someone mentions your bot.

### Process messages matching a pattern

Use the Regex Pattern field to only trigger on messages that match a specific pattern:
- Pattern: `help|assist|support`
- Flags: `i`

This will trigger the workflow only when messages containing "help", "assist", or "support" (case-insensitive) are posted.

### Monitor channel creation

Set the trigger to `channel_created` to run workflows whenever a new channel is created in your workspace.

## Example Workflow

Here's an example of a simple workflow that responds to Slack mentions:

```
[Slack Socket Trigger] → [JSON Parse] → [IF] → [HTTP Request] → [Slack]
```

1. **Slack Socket Trigger**: Configured to trigger on app mentions
2. **JSON Parse**: Extracts the message text and channel from the event data
3. **IF**: Checks if the message contains certain keywords
4. **HTTP Request**: Fetches relevant data based on the message
5. **Slack**: Sends a response back to the channel

This workflow allows you to create a Slack bot that responds to mentions with data from external APIs, all without needing to expose your n8n instance to the internet.

## Compatibility

- Requires n8n version 1.6.0 or later
- Tested against n8n versions 1.91.3
- Uses Bun as package manager for improved performance

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Slack API Documentation](https://api.slack.com/apis)
- [Slack Socket Mode Documentation](https://api.slack.com/apis/connections/socket)
- [Slack Events API Documentation](https://api.slack.com/events)
- [Bun Documentation](https://bun.sh/docs)

## Version History

- **1.0.0**: Initial release - Project initialized with Socket Mode support for Slack events
  - Support for app_mention, message, reaction events
  - Added button interaction support
