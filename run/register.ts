import * as serverCommands from '../src/server/commands';

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

const commandName = process.argv[2];

if (!commandName) {
  console.error('Usage: bun run/register.ts <command-name>');
  process.exit(1);
}

// Gather all exported commands dynamically to ensure we check against all available commands
const availableCommands = Object.values(serverCommands).filter(
  (exportVal) => typeof exportVal === 'object' && exportVal !== null && 'name' in exportVal && 'description' in exportVal
);

const commandToRegister = availableCommands.find((c: any) => c.name === commandName);

if (!commandToRegister) {
  console.error(`Command '${commandName}' not found in the available commands list.`);
  process.exit(1);
}

async function registerCommand() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'POST',
    body: JSON.stringify(commandToRegister),
  });

  if (response.ok) {
    console.log(`Successfully registered command: ${commandName}`);
  } else {
    console.error(`Error registering command: ${commandName}`);
    const text = await response.text();
    console.error(text);
    process.exit(1);
  }
}

await registerCommand();
