import { InteractionResponseFlags } from "discord-interactions"

const paths = {
  onNew: (applicationId: string, interactionToken: string) => `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
  onOriginal: (applicationId: string, interactionToken: string) => `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`,
} as const

const _fetch = async (
  path: string,
  method: 'POST' | 'PATCH',
  content: string,
  flags: InteractionResponseFlags[],
) => {
  await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      flags: flags.reduce((acc, flag) => acc | flag, 0),
    }),
  })
}

export const updateDiscordMessage = async (
  applicationId: string,
  interactionToken: string,
  content: string,
) => {
  await _fetch(
    paths.onOriginal(applicationId, interactionToken),
    'PATCH',
    content,
    [],
  )
}

export const createDiscordFollowupMessage = async (
  applicationId: string,
  interactionToken: string,
  content: string,
) => {
  await _fetch(
    paths.onNew(applicationId, interactionToken),
    'POST',
    content,
    [],
  )
}

export const createEphemeralDiscordFollowupMessage = async (
  applicationId: string,
  interactionToken: string,
  content: string,
) => {
  await _fetch(
    paths.onNew(applicationId, interactionToken),
    'POST',
    content,
    [InteractionResponseFlags.EPHEMERAL],
  )
}
