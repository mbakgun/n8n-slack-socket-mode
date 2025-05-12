import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SlackSocketCredentialsApi implements ICredentialType {
	name = 'slackSocketCredentialsApi';
	displayName = 'Slack Socket Mode Credentials API';
	documentationUrl = 'https://api.slack.com/authentication/basics';
	icon = 'file:./assets/slack-socket-mode.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Bot User OAuth Token',
			name: 'botToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Slack Bot User OAuth Token (starts with xoxb-)',
		},
		{
			displayName: 'App-Level Token',
			name: 'appToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Slack App-Level Token for Socket Mode (starts with xapp-)',
		},
		{
			displayName: 'Signing Secret',
			name: 'signingSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Slack App Signing Secret',
		},
	];
}
