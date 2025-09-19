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
  - All Slack events are now supported (app_mention, message, reaction events, channel events, etc.)
  - See the Supported Events section below for a complete list of available events

- **Regex Pattern**: Optional regular expression to match against incoming Slack messages
- **Regex Flags**: Flags for the regular expression (e.g., `g` for global, `i` for case-insensitive)
- **Channel ID**: Optional channel ID to filter events (e.g., `C1234567890`). If specified, only events from this channel will trigger the workflow

This node supports using an HTTP or HTTPS proxy by reading the following environment variables:

```bash
export HTTP_PROXY=http://proxy.example.com:3128
# or
export HTTPS_PROXY=http://proxy.example.com:3128
```

## Supported Events

The node currently supports the following Slack events:

- `app_mention`: When your bot is mentioned in a channel
- `block_actions`: When a user interacts with buttons, including NPS-style ratings
- `message`: When a message is posted to a channel the app is added to
- `channel_created`: When a new public channel is created
- `team_join`: When a new user is added to Slack
- `reaction_added`: When a reaction is added to a message
- `reaction_removed`: When a reaction is removed from a message
- `app_deleted`: User has deleted an app
- `app_home_opened`: User clicked into your App Home
- `app_installed`: User has installed an app
- `app_mention`: Subscribe to only the message events that mention your app or bot
- `app_rate_limited`: Indicates your app's event subscriptions are being rate limited
- `app_requested`: User requested an app
- `app_uninstalled`: Your Slack app was uninstalled
- `app_uninstalled_team`: User has uninstalled an app
- `assistant_thread_context_changed`: The context changed while an AI assistant thread was visible
- `assistant_thread_started`: An AI assistant thread was started
- `bot_added`: A bot user was added
- `bot_changed`: A bot user was changed
- `call_rejected`: A Call was rejected
- `channel_archive`: A channel was archived
- `channel_created`: A channel was created
- `channel_deleted`: A channel was deleted
- `channel_history_changed`: Bulk updates were made to a channel's history
- `channel_id_changed`: A channel ID changed
- `channel_joined`: You joined a channel
- `channel_left`: You left a channel
- `channel_marked`: Your channel read marker was updated
- `channel_rename`: A channel was renamed
- `channel_shared`: A channel has been shared with an external workspace
- `channel_unarchive`: A channel was unarchived
- `channel_unshared`: A channel has been unshared with an external workspace
- `commands_changed`: A slash command has been added or changed
- `dnd_updated`: Do not Disturb settings changed for the current user
- `dnd_updated_user`: Do not Disturb settings changed for a member
- `email_domain_changed`: The workspace email domain has changed
- `emoji_changed`: A custom emoji has been added or changed
- `external_org_migration_finished`: An enterprise grid migration has finished on an external workspace
- `external_org_migration_started`: An enterprise grid migration has started on an external workspace
- `file_change`: A file was changed
- `file_comment_added`: A file comment was added
- `file_comment_deleted`: A file comment was deleted
- `file_comment_edited`: A file comment was edited
- `file_created`: A file was created
- `file_deleted`: A file was deleted
- `file_public`: A file was made public
- `file_shared`: A file was shared
- `file_unshared`: A file was unshared
- `function_executed`: Your app function is executed as a step in a workflow
- `goodbye`: The server intends to close the connection soon
- `grid_migration_finished`: An enterprise grid migration has finished on this workspace
- `grid_migration_started`: An enterprise grid migration has started on this workspace
- `group_archive`: A private channel was archived
- `group_close`: You closed a private channel
- `group_deleted`: A private channel was deleted
- `group_history_changed`: Bulk updates were made to a private channel's history
- `group_joined`: You joined a private channel
- `group_left`: You left a private channel
- `group_marked`: A private channel read marker was updated
- `group_open`: You created a group DM
- `group_rename`: A private channel was renamed
- `group_unarchive`: A private channel was unarchived
- `hello`: The client has successfully connected to the server
- `im_close`: You closed a DM
- `im_created`: A DM was created
- `im_history_changed`: Bulk updates were made to a DM's history
- `im_marked`: A direct message read marker was updated
- `im_open`: You opened a DM
- `invite_requested`: User requested an invite
- `link_shared`: A message was posted containing one or more links relevant to your application
- `manual_presence_change`: You manually updated your presence
- `member_joined_channel`: A user joined a public channel, private channel or MPDM
- `member_left_channel`: A user left a public or private channel
- `message`: A message was sent to a channel
- `message.app_home`: A user sent a message to your Slack app
- `message.channels`: A message was posted to a channel
- `message.groups`: A message was posted to a private channel
- `message.im`: A message was posted in a direct message channel
- `message.mpim`: A message was posted in a multiparty direct message channel
- `message_metadata_deleted`: Message metadata was deleted
- `message_metadata_posted`: Message metadata was posted
- `message_metadata_updated`: Message metadata was updated
- `pin_added`: A pin was added to a channel
- `pin_removed`: A pin was removed from a channel
- `pref_change`: You have updated your preferences
- `presence_change`: A member's presence changed
- `presence_query`: Determine the current presence status for a list of users
- `presence_sub`: Subscribe to presence events for the specified users
- `reaction_added`: A member has added an emoji reaction to an item
- `reaction_removed`: A member removed an emoji reaction
- `reconnect_url`: Experimental
- `resources_added`: Access to a set of resources was granted for your app
- `resources_removed`: Access to a set of resources was removed for your app
- `scope_denied`: OAuth scopes were denied to your app
- `scope_granted`: OAuth scopes were granted to your app
- `shared_channel_invite_accepted`: A shared channel invite was accepted
- `shared_channel_invite_approved`: A shared channel invite was approved
- `shared_channel_invite_declined`: A shared channel invite was declined
- `shared_channel_invite_received`: A shared channel invite was sent to a Slack user
- `shared_channel_invite_requested`: A shared channel invite was requested
- `star_added`: A member has saved an item for later or starred an item
- `star_removed`: A member has removed an item saved for later or starred an item
- `subteam_created`: A User Group has been added to the workspace
- `subteam_members_changed`: The membership of an existing User Group has changed
- `subteam_self_added`: You have been added to a User Group
- `subteam_self_removed`: You have been removed from a User Group
- `subteam_updated`: An existing User Group has been updated or its members changed
- `team_access_granted`: Access to a set of teams was granted to your org app
- `team_access_revoked`: Access to a set of teams was revoked from your org app
- `team_domain_change`: The workspace domain has changed
- `team_join`: A new member has joined
- `team_migration_started`: The workspace is being migrated between servers
- `team_plan_change`: The account billing plan has changed
- `team_pref_change`: A preference has been updated
- `team_profile_change`: The workspace profile fields have been updated
- `team_profile_delete`: The workspace profile fields have been deleted
- `team_profile_reorder`: The workspace profile fields have been reordered
- `team_rename`: The workspace name has changed
- `tokens_revoked`: API tokens for your app were revoked
- `url_verification`: Verifies ownership of an Events API Request URL
- `user_change`: A member's data has changed
- `user_resource_denied`: User resource was denied to your app
- `user_resource_granted`: User resource was granted to your app
- `user_resource_removed`: User resource was removed from your app
- `user_typing`: A channel member is typing a message
- `workflow_deleted`: A workflow that contains a step supported by your app was deleted
- `workflow_published`: A workflow that contains a step supported by your app was published
- `workflow_step_deleted`: A workflow step supported by your app was removed from a workflow
- `workflow_step_execute`: A workflow step supported by your app should execute
- `workflow_unpublished`: A workflow that contains a step supported by your app was unpublished

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

## Contributors

We appreciate all contributions to this project! 🎉

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure build passes (`bun run build`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Special thanks to all contributors who help improve this project!

## Version History

- **1.3.2**: Fixed block actions acknowledgement by **[@keenlim](https://github.com/keenlim)**
  - Added proper acknowledgement for block actions interactions
  - Fixed socket to Slack communication for button interactions


- **1.3.1**: Enhanced channel filtering for all event types
  - Fixed channel filtering for events like `reaction_added`, `pin_added`, `file_shared`, etc.
  - Added comprehensive channel ID extraction from multiple event properties (`event.channel`, `event.item.channel`, `event.item.channel_id`, `event.file.channels`)
- **1.3.0**: Channel filtering feature by **[@tongshengng](https://github.com/tongshengng)**
  - Added "Channel to watch" field similar to official Slack trigger node
  - Implemented optional channel ID parameter to filter incoming Slack events
  - Added searchable dropdown with channel selection via Slack API
  - Improved event targeting by filtering events from specific channels only
  - Added channel ID format validation for manual entry
- **1.2.5**: Added proxy support by **[@minimorph223](https://github.com/minimorph223)**
  - Added `http-proxy-agent` dependency for HTTP/HTTPS proxy support
  - Enhanced connectivity options for enterprise environments
- **1.2.3**: Enhanced message filtering by **[@macchiang](https://github.com/macchiang)**
  - Fixed invalid `message.im` event type with proper channel_type filtering
  - Added support for filtering Slack messages by channel type (channels, groups, im, mpim, app_home)
  - Improved message filtering capabilities using Slack Bolt framework best practices
  - Resolved TypeScript typing issues
- **1.2.0**: Added support for all Slack events
  - Updated to include all events from the Slack Events API
  - Improved event descriptions and documentation
- **1.0.0**: Initial release - Project initialized with Socket Mode support for Slack events
  - Support for app_mention, message, reaction events
  - Added button interaction support

## License

MIT License

Copyright (c) 2025 Mehmet Burak Akgün

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
