/**
 * This file is meant to be run from the command line, and is not used by the
 * application server. It fetches all the globally registered global commands.
 */

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.'
  );
}

async function fetchGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'GET',
  });

  if (response.ok) {
    const commands = await response.json();
    console.log('Successfully fetched global commands:');
    console.log(JSON.stringify(commands, null, 2));
  } else {
    console.error('Error fetching global commands');
    const text = await response.text();
    console.error(text);
  }
}

await fetchGlobalCommands();
export {}
