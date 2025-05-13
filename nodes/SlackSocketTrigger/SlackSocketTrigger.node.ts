import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType
} from 'n8n-workflow';
import { App } from '@slack/bolt'

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
		version: 1,
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
				options: [
					{
						name: 'Bot / App Mention',
						value: 'app_mention',
						description: 'When your bot or app is mentioned in a channel the app is added to',
					},
					{
						name: 'Button Interaction',
						value: 'block_actions',
						description: 'When a user interacts with buttons, including NPS-style ratings',
					},
					{
						name: 'New Message Posted to Channel',
						value: 'message',
						description: 'When a message is posted to a channel the app is added to',
					},
					{
						name: 'New Public Channel Created',
						value: 'channel_created',
						description: 'When a new public channel is created',
					},
					{
						name: 'New User',
						value: 'team_join',
						description: 'When a new user is added to Slack',
					},
					{
						name: 'Reaction Added',
						value: 'reaction_added',
						description: 'When a reaction is added to a message the app is added to',
					},
					{
						name: 'Reaction Removed',
						value: 'reaction_removed',
						description: 'When a reaction is removed from a message the app is added to',
					},
				],
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
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const filters = this.getNodeParameter('trigger', []) as string[];
		const pattern = this.getNodeParameter('regexPattern') as string;
		const flags = this.getNodeParameter('regexFlags') as string;
		const regExp = pattern.length > 0 ? new RegExp(pattern, flags) : undefined;
		const credentials = await this.getCredentials<SlackCredential>('slackSocketCredentialsApi')

		const app = new App({
			token: credentials.botToken,
			signingSecret: credentials.signingSecret,
			appToken: credentials.appToken,
			socketMode: true,
		});

		const processedActions = new Map<string, number>();
		const TRACKING_EXPIRATION_MS = 30000;

		const process = async (root: any) => {
			const { body, payload, context, event } = root;
			let result: IDataObject = { body, payload, context, event };
			this.emit([this.helpers.returnJsonArray(result)]);
		}

		const setupEventListeners = () => {
			filters.forEach((filter) => {
				if (filter === 'message' && regExp) {
					app.message(regExp, process);
				} else if (filter === 'block_actions') {
					app.action(/.*/, async ({ ack, body, action }) => {
						try {
							await ack();

							const bodyObj = body as any;
							const actionKey = `${bodyObj.message_ts || ''}:${bodyObj.container?.message_ts || ''}:${new Date().getTime()}`;

							if (processedActions.has(actionKey)) {
								return;
							}

							processedActions.set(actionKey, Date.now());

							setTimeout(() => {
								processedActions.delete(actionKey);
							}, TRACKING_EXPIRATION_MS);

							const result: IDataObject = { body, payload: action, context: null, event: body };
							this.emit([this.helpers.returnJsonArray(result)]);
						} catch (error) {
							this.logger.error('Error processing block action:', error);
						}
					});
				} else {
					app.event(filter, process);
				}
			});
		};

		setupEventListeners();

		const manualTriggerFunction = async () => {
			try {
				await app.start();
				this.logger.info('Started Slack Socket app in test mode');
			} catch (error) {
				this.logger.error('Error starting Slack Socket app in test mode:', error);
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
				this.logger.error('Error starting Slack Socket app in trigger mode:', error);
			}
		}

		const closeFunction = async () => {
			try {
				await app.stop();
				this.logger.info('Stopped Slack Socket app');
			} catch (error) {
				this.logger.error('Error stopping Slack Socket app:', error);
			}
		};

		return {
			closeFunction,
			manualTriggerFunction
		};
	}
}


