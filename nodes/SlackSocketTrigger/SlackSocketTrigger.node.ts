import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError
} from 'n8n-workflow';
import { App } from '@slack/bolt'
import { HttpsProxyAgent } from 'https-proxy-agent'

interface SlackCredential {
	botToken: string;
	appToken: string;
	signingSecret: string;
}

export class SlackSocketTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Slack Socket Mode Trigger',
		name: 'slackSocketTrigger',
		group: ['trigger'],
		version: 2,
		description: 'Triggers workflow when a Slack message matches a regex pattern via Socket Mode',
		defaults: {
			name: 'Slack Socket Mode Trigger',
		},
		icon: 'file:./assets/slack-socket-mode.svg',
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'slackSocketCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'trigger',
				type: 'multiOptions',
				options: [{
					name: 'App Deleted',
					value: 'app_deleted',
					description: 'When a user has deleted an app',
				},
				{
					name: 'App Home Opened',
					value: 'app_home_opened',
					description: 'When a user clicks into your App Home',
				},
				{
					name: 'App Installed',
					value: 'app_installed',
					description: 'When a user has installed an app',
				},
				{
					name: 'App Mention',
					value: 'app_mention',
					description: 'When your bot or app is mentioned in a channel',
				},
				{
					name: 'App Rate Limited',
					value: 'app_rate_limited',
					description: 'When your app\'s event subscriptions are being rate limited',
				},
				{
					name: 'App Requested',
					value: 'app_requested',
					description: 'When a user requested an app',
				},
				{
					name: 'App Uninstalled',
					value: 'app_uninstalled',
					description: 'When your Slack app was uninstalled',
				},
				{
					name: 'App Uninstalled Team',
					value: 'app_uninstalled_team',
					description: 'When a user has uninstalled an app',
				},
				{
					name: 'Assistant Thread Context Changed',
					value: 'assistant_thread_context_changed',
					description: 'When the context changed while an AI assistant thread was visible',
				},
				{
					name: 'Assistant Thread Started',
					value: 'assistant_thread_started',
					description: 'When an AI assistant thread was started',
				},
				{
					name: 'Bot Added',
					value: 'bot_added',
					description: 'When a bot user was added',
				},
				{
					name: 'Bot Changed',
					value: 'bot_changed',
					description: 'When a bot user was changed',
				},
				{
					name: 'Button Interaction',
					value: 'block_actions',
					description: 'When a user interacts with buttons, including NPS-style ratings',
				},
				{
					name: 'Call Rejected',
					value: 'call_rejected',
					description: 'When a call was rejected',
				},
				{
					name: 'Channel Archive',
					value: 'channel_archive',
					description: 'When a channel was archived',
				},
				{
					name: 'Channel Created',
					value: 'channel_created',
					description: 'When a new channel was created',
				},
				{
					name: 'Channel Deleted',
					value: 'channel_deleted',
					description: 'When a channel was deleted',
				},
				{
					name: 'Channel History Changed',
					value: 'channel_history_changed',
					description: 'When bulk updates were made to a channel\'s history',
				},
				{
					name: 'Channel ID Changed',
					value: 'channel_id_changed',
					description: 'When a channel ID changed',
				},
				{
					name: 'Channel Joined',
					value: 'channel_joined',
					description: 'When you joined a channel',
				},
				{
					name: 'Channel Left',
					value: 'channel_left',
					description: 'When you left a channel',
				},
				{
					name: 'Channel Marked',
					value: 'channel_marked',
					description: 'When your channel read marker was updated',
				},
				{
					name: 'Channel Rename',
					value: 'channel_rename',
					description: 'When a channel was renamed',
				},
				{
					name: 'Channel Shared',
					value: 'channel_shared',
					description: 'When a channel has been shared with an external workspace',
				},
				{
					name: 'Channel Unarchive',
					value: 'channel_unarchive',
					description: 'When a channel was unarchived',
				},
				{
					name: 'Channel Unshared',
					value: 'channel_unshared',
					description: 'When a channel has been unshared with an external workspace',
				},
				{
					name: 'Commands Changed',
					value: 'commands_changed',
					description: 'When a slash command has been added or changed',
				},
				{
					name: 'DND Updated',
					value: 'dnd_updated',
					description: 'When Do not Disturb settings changed for the current user',
				},
				{
					name: 'DND Updated User',
					value: 'dnd_updated_user',
					description: 'When Do not Disturb settings changed for a member',
				},
				{
					name: 'Email Domain Changed',
					value: 'email_domain_changed',
					description: 'When the workspace email domain has changed',
				},
				{
					name: 'Emoji Changed',
					value: 'emoji_changed',
					description: 'When a custom emoji has been added or changed',
				},
				{
					name: 'External Org Migration Finished',
					value: 'external_org_migration_finished',
					description: 'When an enterprise grid migration has finished on an external workspace',
				},
				{
					name: 'External Org Migration Started',
					value: 'external_org_migration_started',
					description: 'When an enterprise grid migration has started on an external workspace',
				},
				{
					name: 'File Change',
					value: 'file_change',
					description: 'When a file was changed',
				},
				{
					name: 'File Comment Added',
					value: 'file_comment_added',
					description: 'When a file comment was added',
				},
				{
					name: 'File Comment Deleted',
					value: 'file_comment_deleted',
					description: 'When a file comment was deleted',
				},
				{
					name: 'File Comment Edited',
					value: 'file_comment_edited',
					description: 'When a file comment was edited',
				},
				{
					name: 'File Created',
					value: 'file_created',
					description: 'When a file was created',
				},
				{
					name: 'File Deleted',
					value: 'file_deleted',
					description: 'When a file was deleted',
				},
				{
					name: 'File Public',
					value: 'file_public',
					description: 'When a file was made public',
				},
				{
					name: 'File Shared',
					value: 'file_shared',
					description: 'When a file was shared',
				},
				{
					name: 'File Unshared',
					value: 'file_unshared',
					description: 'When a file was unshared',
				},
				{
					name: 'Function Executed',
					value: 'function_executed',
					description: 'When your app function is executed as a step in a workflow',
				},
				{
					name: 'Grid Migration Finished',
					value: 'grid_migration_finished',
					description: 'When an enterprise grid migration has finished on this workspace',
				},
				{
					name: 'Grid Migration Started',
					value: 'grid_migration_started',
					description: 'When an enterprise grid migration has started on this workspace',
				},
				{
					name: 'Group Archive',
					value: 'group_archive',
					description: 'When a private channel was archived',
				},
				{
					name: 'Group Close',
					value: 'group_close',
					description: 'When you closed a private channel',
				},
				{
					name: 'Group Deleted',
					value: 'group_deleted',
					description: 'When a private channel was deleted',
				},
				{
					name: 'Group History Changed',
					value: 'group_history_changed',
					description: 'When bulk updates were made to a private channel\'s history',
				},
				{
					name: 'Group Joined',
					value: 'group_joined',
					description: 'When you joined a private channel',
				},
				{
					name: 'Group Left',
					value: 'group_left',
					description: 'When you left a private channel',
				},
				{
					name: 'Group Marked',
					value: 'group_marked',
					description: 'When a private channel read marker was updated',
				},
				{
					name: 'Group Open',
					value: 'group_open',
					description: 'When you created a group DM',
				},
				{
					name: 'Group Rename',
					value: 'group_rename',
					description: 'When a private channel was renamed',
				},
				{
					name: 'Group Unarchive',
					value: 'group_unarchive',
					description: 'When a private channel was unarchived',
				},
				{
					name: 'Hello',
					value: 'hello',
					description: 'When the client has successfully connected to the server',
				},
				{
					name: 'IM Close',
					value: 'im_close',
					description: 'When you closed a DM',
				},
				{
					name: 'IM Created',
					value: 'im_created',
					description: 'When a DM was created',
				},
				{
					name: 'IM History Changed',
					value: 'im_history_changed',
					description: 'When bulk updates were made to a DM\'s history',
				},
				{
					name: 'IM Marked',
					value: 'im_marked',
					description: 'When a direct message read marker was updated',
				},
				{
					name: 'IM Open',
					value: 'im_open',
					description: 'When you opened a DM',
				},
				{
					name: 'Invite Requested',
					value: 'invite_requested',
					description: 'When a user requested an invite',
				},
				{
					name: 'Link Shared',
					value: 'link_shared',
					description: 'When a message was posted containing links relevant to your application',
				},
				{
					name: 'Manual Presence Change',
					value: 'manual_presence_change',
					description: 'When you manually updated your presence',
				},
				{
					name: 'Member Joined Channel',
					value: 'member_joined_channel',
					description: 'When a user joined a public channel, private channel or MPDM',
				},
				{
					name: 'Member Left Channel',
					value: 'member_left_channel',
					description: 'When a user left a public or private channel',
				},
				{
					name: 'Message',
					value: 'message',
					description: 'When a message was sent to a channel',
				},
				{
					name: 'Message App Home',
					value: 'message.app_home',
					description: 'When a user sent a message to your Slack app',
				},
				{
					name: 'Message Channels',
					value: 'message.channels',
					description: 'When a message was posted to a channel',
				},
				{
					name: 'Message Groups',
					value: 'message.groups',
					description: 'When a message was posted to a private channel',
				},
				{
					name: 'Message IM',
					value: 'message.im',
					description: 'When a message was posted in a direct message channel',
				},
				{
					name: 'Message Metadata Deleted',
					value: 'message_metadata_deleted',
					description: 'When message metadata was deleted',
				},
				{
					name: 'Message Metadata Posted',
					value: 'message_metadata_posted',
					description: 'When message metadata was posted',
				},
				{
					name: 'Message Metadata Updated',
					value: 'message_metadata_updated',
					description: 'When message metadata was updated',
				},
				{
					name: 'Message MPIM',
					value: 'message.mpim',
					description: 'When a message was posted in a multiparty direct message channel',
				},
				{
					name: 'Pin Added',
					value: 'pin_added',
					description: 'When a pin was added to a channel',
				},
				{
					name: 'Pin Removed',
					value: 'pin_removed',
					description: 'When a pin was removed from a channel',
				},
				{
					name: 'Pref Change',
					value: 'pref_change',
					description: 'When you have updated your preferences',
				},
				{
					name: 'Presence Change',
					value: 'presence_change',
					description: 'When a member\'s presence changed',
				},
				{
					name: 'Reaction Added',
					value: 'reaction_added',
					description: 'When a member has added an emoji reaction to an item',
				},
				{
					name: 'Reaction Removed',
					value: 'reaction_removed',
					description: 'When a member removed an emoji reaction',
				},
				{
					name: 'Resources Added',
					value: 'resources_added',
					description: 'When access to a set of resources was granted for your app',
				},
				{
					name: 'Resources Removed',
					value: 'resources_removed',
					description: 'When access to a set of resources was removed for your app',
				},
				{
					name: 'Scope Denied',
					value: 'scope_denied',
					description: 'When OAuth scopes were denied to your app',
				},
				{
					name: 'Scope Granted',
					value: 'scope_granted',
					description: 'When OAuth scopes were granted to your app',
				},
				{
					name: 'Shared Channel Invite Accepted',
					value: 'shared_channel_invite_accepted',
					description: 'When a shared channel invite was accepted',
				},
				{
					name: 'Shared Channel Invite Approved',
					value: 'shared_channel_invite_approved',
					description: 'When a shared channel invite was approved',
				},
				{
					name: 'Shared Channel Invite Declined',
					value: 'shared_channel_invite_declined',
					description: 'When a shared channel invite was declined',
				},
				{
					name: 'Shared Channel Invite Received',
					value: 'shared_channel_invite_received',
					description: 'When a shared channel invite was sent to a Slack user',
				},
				{
					name: 'Shared Channel Invite Requested',
					value: 'shared_channel_invite_requested',
					description: 'When a shared channel invite was requested',
				},
				{
					name: 'Star Added',
					value: 'star_added',
					description: 'When a member has saved an item for later or starred an item',
				},
				{
					name: 'Star Removed',
					value: 'star_removed',
					description: 'When a member has removed an item saved for later or starred an item',
				},
				{
					name: 'Subteam Created',
					value: 'subteam_created',
					description: 'When a User Group has been added to the workspace',
				},
				{
					name: 'Subteam Members Changed',
					value: 'subteam_members_changed',
					description: 'When the membership of an existing User Group has changed',
				},
				{
					name: 'Subteam Self Added',
					value: 'subteam_self_added',
					description: 'When you have been added to a User Group',
				},
				{
					name: 'Subteam Self Removed',
					value: 'subteam_self_removed',
					description: 'When you have been removed from a User Group',
				},
				{
					name: 'Subteam Updated',
					value: 'subteam_updated',
					description: 'When an existing User Group has been updated or its members changed',
				},
				{
					name: 'Team Access Granted',
					value: 'team_access_granted',
					description: 'When access to a set of teams was granted to your org app',
				},
				{
					name: 'Team Access Revoked',
					value: 'team_access_revoked',
					description: 'When access to a set of teams was revoked from your org app',
				},
				{
					name: 'Team Domain Change',
					value: 'team_domain_change',
					description: 'When the workspace domain has changed',
				},
				{
					name: 'Team Join',
					value: 'team_join',
					description: 'When a new member has joined',
				},
				{
					name: 'Team Plan Change',
					value: 'team_plan_change',
					description: 'When the account billing plan has changed',
				},
				{
					name: 'Team Pref Change',
					value: 'team_pref_change',
					description: 'When a preference has been updated',
				},
				{
					name: 'Team Profile Change',
					value: 'team_profile_change',
					description: 'When the workspace profile fields have been updated',
				},
				{
					name: 'Team Profile Delete',
					value: 'team_profile_delete',
					description: 'When the workspace profile fields have been deleted',
				},
				{
					name: 'Team Profile Reorder',
					value: 'team_profile_reorder',
					description: 'When the workspace profile fields have been reordered',
				},
				{
					name: 'Team Rename',
					value: 'team_rename',
					description: 'When the workspace name has changed',
				},
				{
					name: 'Tokens Revoked',
					value: 'tokens_revoked',
					description: 'When API tokens for your app were revoked',
				},
				{
					name: 'URL Verification',
					value: 'url_verification',
					description: 'When verifying ownership of an Events API Request URL',
				},
				{
					name: 'User Change',
					value: 'user_change',
					description: 'When a member\'s data has changed',
				},
				{
					name: 'User Resource Denied',
					value: 'user_resource_denied',
					description: 'When user resource was denied to your app',
				},
				{
					name: 'User Resource Granted',
					value: 'user_resource_granted',
					description: 'When user resource was granted to your app',
				},
				{
					name: 'User Resource Removed',
					value: 'user_resource_removed',
					description: 'When user resource was removed from your app',
				},
				{
					name: 'User Typing',
					value: 'user_typing',
					description: 'When a channel member is typing a message',
				},
				{
					name: 'View Submitted',
					value: 'view_submission',
					description: 'When a modal view is submitted (contains submitted values)',
				},
				{
					name: 'View Closed',
					value: 'view_closed',
					description: 'When a modal view is closed (contains view details and private_metadata)',
				},
				{
					name: 'Workflow Deleted',
					value: 'workflow_deleted',
					description: 'When a workflow that contains a step supported by your app was deleted',
				},
				{
					name: 'Workflow Published',
					value: 'workflow_published',
					description: 'When a workflow that contains a step supported by your app was published',
				},
				{
					name: 'Workflow Step Deleted',
					value: 'workflow_step_deleted',
					description: 'When a workflow step supported by your app was removed from a workflow',
				},
				{
					name: 'Workflow Step Execute',
					value: 'workflow_step_execute',
					description: 'When a workflow step supported by your app should execute',
				},
				{
					name: 'Workflow Unpublished',
					value: 'workflow_unpublished',
					description: 'When a workflow that contains a step supported by your app was unpublished',
				},],
				default: [],
			},
			{
				displayName: 'Regex Pattern',
				name: 'regexPattern',
				type: 'string',
				default: '',
				placeholder: 'regex pattern',
				description:
					'Regular expression to match against incoming Slack messages. Capture groups can be used to extract data.',
			},
			{
				displayName: 'Regex Flags',
				name: 'regexFlags',
				type: 'string',
				default: 'g',
				placeholder: 'gmi',
				description:
					'Flags for the regular expression (e.g., g for global, i for case-insensitive)',
			},
			{
				displayName: 'Channels to Watch',
				name: 'channelsToWatch',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Channel',
				description: 'Select channels to filter events. If specified, only events from these channels will trigger the workflow. To enter IDs manually, add each channel separately (e.g., C1234567890, G1234567890).',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Channel',
				},
				options: [
					{
						name: 'channelValues',
						displayName: 'Channel',
						values: [
							{
								displayName: 'Channel',
								name: 'channel',
								type: 'resourceLocator',
								default: { mode: 'list', value: '' },
								placeholder: 'Select a channel',
								description: 'Channel to watch for events',
								modes: [
									{
										displayName: 'From List',
										name: 'list',
										type: 'list',
										placeholder: 'Select a channel',
										typeOptions: {
											searchListMethod: 'channelSearch',
											searchable: true,
										},
									},
									{
										displayName: 'By ID',
										name: 'id',
										type: 'string',
										placeholder: 'C1234567890',
										validation: [
											{
												type: 'regex',
												properties: {
													regex: '^[C|G|D][A-Z0-9]{8,}$',
													errorMessage: 'Not a valid Slack channel ID',
												},
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Legacy Channel to Watch',
				name: 'channelToWatch',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				placeholder: 'Select a channel',
				description: 'Legacy single-channel selector retained for workflows created before version 1.4.0',
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a channel',
						typeOptions: {
							searchListMethod: 'channelSearch',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'C1234567890',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^[C|G|D][A-Z0-9]{8,}$',
									errorMessage: 'Not a valid Slack channel ID',
								},
							},
						],
					},
				],
			},
		],
	};

	methods = {
		listSearch: {
			async channelSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const credentials = await this.getCredentials('slackSocketCredentialsApi') as SlackCredential;

				if (!credentials.botToken) {
					throw new NodeOperationError(this.getNode(), 'Bot token is required to load channels');
				}

				const app = new App({
					token: credentials.botToken,
					signingSecret: credentials.signingSecret,
					appToken: credentials.appToken,
				});

				try {
					const result = await app.client.conversations.list({
						types: 'public_channel,private_channel',
						exclude_archived: true,
					});

					const results = [];

					if (result.channels) {
						for (const channel of result.channels) {
							if (channel.name && channel.id) {
								results.push({
									name: `#${channel.name}`,
									value: channel.id,
									description: channel.purpose?.value || '',
								});
							}
						}
					}

					return { results };
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to load channels: ${error}`);
				}
			},
		},
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const filters = this.getNodeParameter('trigger', []) as string[];
		const pattern = this.getNodeParameter('regexPattern') as string;
		const flags = this.getNodeParameter('regexFlags') as string;
		const channelsToWatch = this.getNodeParameter('channelsToWatch', {}) as {
			channelValues?: Array<{ channel?: { mode?: string; value?: string } }>;
		};
		const legacyChannelToWatch = this.getNodeParameter('channelToWatch', null) as
			| { mode?: string; value?: string }
			| null;

		const channelIds: string[] = [];

		if (channelsToWatch?.channelValues && Array.isArray(channelsToWatch.channelValues)) {
			for (const item of channelsToWatch.channelValues) {
				if (item?.channel?.value && typeof item.channel.value === 'string') {
					channelIds.push(item.channel.value);
				}
			}
		}

		if (legacyChannelToWatch?.value && typeof legacyChannelToWatch.value === 'string' && legacyChannelToWatch.value.length > 0) {
			channelIds.push(legacyChannelToWatch.value);
		}

		const uniqueChannelIds = Array.from(new Set(channelIds));

		const regExp = pattern.length > 0 ? new RegExp(pattern, flags) : undefined;

		let credentials: SlackCredential;
		try {
			credentials = await this.getCredentials<SlackCredential>('slackSocketCredentialsApi');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Failed to get Slack Socket credentials: ' + error);
		}

		if (!credentials.botToken || !credentials.appToken || !credentials.signingSecret) {
			throw new NodeOperationError(this.getNode(), 'Missing required Slack Socket credentials');
		}
		const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
		const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
		const app = new App({
			token: credentials.botToken,
			signingSecret: credentials.signingSecret,
			appToken: credentials.appToken,
			socketMode: true,
			clientOptions: { agent },
		});

		const getEventChannelId = (event: any): string | null => {
			if (!event) return null;

			if (event.channel) {
				return event.channel;
			}

			if (event.item?.channel) {
				return event.item.channel;
			}

			if (event.item?.channel_id) {
				return event.item.channel_id;
			}

			if (event.file?.channels && Array.isArray(event.file.channels) && event.file.channels.length > 0) {
				return event.file.channels[0];
			}

			return null;
		};

		const socketProcess = async (root: any) => {
			try {
				// root can contain many keys depending on the interaction: body, payload, context, event, view, etc.
				// include all non-function keys so view_submission/view_closed payloads are emitted with their view data
				const event = root?.event;

				if (uniqueChannelIds.length > 0 && event) {
					const eventChannelId = getEventChannelId(event);
					if (eventChannelId && !uniqueChannelIds.includes(eventChannelId)) {
						return;
					}
				}

				const sanitized: IDataObject = {};
				for (const key of Object.keys(root)) {
					const val = root[key];
					// do not include functions (ack, respond, etc.) as they are not serializable and not useful in the output
					if (typeof val !== 'function') {
						sanitized[key] = val as any;
					}
				}

				this.emit([this.helpers.returnJsonArray(sanitized)]);
			} catch (error) {
				this.logger.error('Error processing Slack Socket event: ' + error);
			}
		}

		const setupEventListeners = () => {
			filters.forEach((filter) => {
				try {
					if (filter === 'message') {
						const handleMessageEvent = async (args: any) => {
							const event = args?.event;
							if (!event) {
								return;
							}

							if (regExp) {
								const jsonString = JSON.stringify(event);
								regExp.lastIndex = 0;
								if (!jsonString || !regExp.test(jsonString)) {
									return;
								}
							}

							await socketProcess(args);
						};

						app.event('message', handleMessageEvent);
					} else if (filter === 'block_actions') {
						app.action(/.*/, async (args: any) => {
							const { ack } = args;
							await ack();
							await socketProcess(args);
						});;
					} else if (filter === 'view_submission') {
						// listen to any view submission (callback_id matching all) and ack if possible
						app.view(/.*/, async (args: any) => {
							try {
								if (typeof args.ack === 'function') {
									// acknowledge the view submission so Slack knows we've received it
									await args.ack();
								}
							} catch (err) {
								this.logger.error('Error acknowledging view_submission: ' + err);
							}
							await socketProcess(args);
						});
					} else if (filter === 'view_closed') {
						// listen to view_closed notifications (modal closed). ack might not be required but call if provided.
						app.view(/.*/, async (args: any) => {
							// view_closed payloads arrive to the same app.view handler; filter by body?.type or body?.view?.type if needed
							try {
								if (typeof args.ack === 'function') {
									await args.ack();
								}
							} catch (err) {
								// ack may not be required; swallow ack errors but log
								this.logger.error('view_closed ack error (safe to ignore): ' + err);
							}
							await socketProcess(args);
						});
					} else if (filter.startsWith('message.')) {
						// Handle message subtypes by filtering on channel_type
						const channelType = filter.replace('message.', '');

						// Map the filter names to actual channel_type values
						const channelTypeMap: { [key: string]: string } = {
							'channels': 'channel',
							'groups': 'group',
							'im': 'im',
							'mpim': 'mpim',
							'app_home': 'app_home'
						};

						const actualChannelType = channelTypeMap[channelType] || channelType;

						const handleMessageSubtypeEvent = async (args: any) => {
							const event = args?.event;
							if (!event || event.channel_type !== actualChannelType) {
								return;
							}

							if (regExp) {
								const jsonString = JSON.stringify(event);
								regExp.lastIndex = 0;
								if (!jsonString || !regExp.test(jsonString)) {
									return;
								}
							}

							await socketProcess(args);
						};

						app.event('message', handleMessageSubtypeEvent);
					} else if (filter === 'reaction_added' || filter === 'reaction_removed') {
						app.event(filter, async (args: any) => {
							const reaction = args?.event?.reaction;
							if (regExp) {
								const reactionName = typeof reaction === 'string' ? reaction : '';
								regExp.lastIndex = 0;
								if (!reactionName || !regExp.test(reactionName)) {
									return;
								}
							}

							await socketProcess(args);
						});
					} else {
						app.event(filter, socketProcess);
					}
				} catch (error) {
					this.logger.error('Error setting up event listener for Slack Socket: ' + filter + ': ' + error);
				}
			});
		};

		setupEventListeners();

		const manualTriggerFunction = async () => {
			try {
				await app.start();
				this.logger.info('Started Slack Socket app in test mode');
			} catch (error) {
				this.logger.error('Error starting Slack Socket app in test mode: ' + error);
				throw error;
			}

			return new Promise<void>((resolve) => {
				resolve();
			});
		};

		if (this.getMode() === 'trigger') {
			try {
				await app.start();
				this.logger.info('Started Slack Socket app in trigger mode');
			} catch (error) {
				this.logger.error('Error starting Slack Socket app in trigger mode: ' + error);
				throw error;
			}
		}

		const closeFunction = async () => {
			try {
				await app.stop();
				this.logger.info('Stopped Slack Socket app');
			} catch (error) {
				this.logger.error('Error stopping Slack Socket app: ' + error);
			}
		};

		return {
			closeFunction,
			manualTriggerFunction
		};
	}
}


