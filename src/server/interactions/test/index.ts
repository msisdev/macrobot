import { ApplicationCommandInteractionHandler } from "@/src/server/interactions/config";
import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { ComponentType, ButtonStyle, TextInputStyle } from "discord-api-types/v10";

const handle: ApplicationCommandInteractionHandler = async (req, env, ctx, msg) => {
  console.log('handling test request');
  
  // 1. Respond with deferred ephemeral message
  const deferredResponse = Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });

  // 2. Update the message content with simple question, textfield and confirmation button
  ctx.waitUntil((async () => {
    const applicationId = env.DISCORD_APPLICATION_ID;
    const interactionToken = msg.token;

    const components = [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.TextInput,
            custom_id: 'test_name_input',
            style: TextInputStyle.Short,
            label: 'What is your name?',
            required: true,
          }
        ]
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            custom_id: 'test_confirm_btn',
            style: ButtonStyle.Primary,
            label: 'Confirm'
          }
        ]
      }
    ];

    await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Please enter your name below and confirm:',
        components,
      }),
    });
  }) ());

  return deferredResponse;
}

// 3. New handle that interacts with the button
export const handleButton = async (req: Request, env: any, ctx: any, msg: any) => {
  console.log('handling test button interaction');
  
  let name = 'Unknown';
  if (msg.data?.components) {
    for (const row of msg.data.components) {
      const input = row.components?.find((c: any) => c.custom_id === 'test_name_input');
      if (input && input.value) {
        name = input.value;
        break;
      }
    }
  }

  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `hello ${name}`,
    },
  });
}

export default {
  name: 'test',
  button_id: 'test_confirm_btn',
  handle,
  handleButton,
}
