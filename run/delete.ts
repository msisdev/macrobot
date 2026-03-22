/**
 * Unregister a specific Discord command by name.
 * Usage: bun run/delete.ts <command-name>
 */

const commandName = process.argv[2];

if (!commandName) {
  console.error('Please provide the command name to delete: bun run/delete.ts <command-name>');
  process.exit(1);
}

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function deleteCommand(name: string) {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  // 1. Fetch all commands
  const getResponse = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!getResponse.ok) {
    console.error('Failed to fetch commands');
    console.error(await getResponse.text());
    process.exit(1);
  }

  const commands = (await getResponse.json()) as { id: string; name: string }[];

  // 2. Find the command by name
  const command = commands.find((c) => c.name === name);

  if (!command) {
    console.error(`Command "${name}" not found.`);
    process.exit(1);
  }

  // 3. Delete the command
  const deleteUrl = `${url}/${command.id}`;
  const deleteResponse = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (deleteResponse.ok) {
    console.log(`Successfully deleted command "${name}" (ID: ${command.id})`);
  } else {
    console.error(`Failed to delete command "${name}"`);
    console.error(await deleteResponse.text());
    process.exit(1);
  }
}

await deleteCommand(commandName);
export {};
