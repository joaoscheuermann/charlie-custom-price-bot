import assert = require('assert');

import {
  Client,
  SlashCommandBuilder,
  Events,
  Interaction,
  InteractionType,
  SlashCommandSubcommandsOnlyBuilder,
  ModalSubmitInteraction,
  CommandInteraction,
  MessageComponentInteraction,
  GatewayIntentBits,
  Guild,
} from 'discord.js';

type LooseObject = {
  [key: string]: any;
};

type InteractionHandler = (
  interaction:
    | Interaction
    | CommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  data: {
    path: string;
    params: {
      [key: string]: string;
    };
    query: {
      [key: string]: string;
    };
    error?: any;
  }
) => Promise<unknown>;

type SlashCommandInitialization = (
  guild: Guild
) => Promise<
  | Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>
  | SlashCommandSubcommandsOnlyBuilder
>;

export class Slash {
  private readonly commands = new Set<
    [SlashCommandInitialization, InteractionHandler]
  >();
  private readonly handlers = new Map<RegExp, InteractionHandler>();

  constructor(private readonly client: Client) {
    assert(
      client.options.intents.has(GatewayIntentBits.Guilds),
      'GatewayIntentBits.Guilds intent is required'
    );

    client.on(
      Events.GuildCreate,
      async (guild): Promise<void> => this.initializeCommandsOnGuild(guild)
    );

    client.on(
      Events.GuildAvailable,
      async (guild): Promise<void> => this.initializeCommandsOnGuild(guild)
    );

    client.on(Events.InteractionCreate, async (interaction) => {
      try {
        const sourcePath = this.path(interaction);

        const [path, ...queryStrings] = sourcePath.split(/\?|&/g);

        const query = queryStrings
          .filter((item) => item && /([^&=]+)=([^&]*)/.test(item))
          .reduce(
            (query: LooseObject, item) =>
              Object.assign(query, Object.fromEntries([item.split('=')])),
            {}
          );

        for (const [regex, handler] of this.handlers.entries()) {
          if (regex.test(path)) {
            const params = regex.exec(path)?.groups || {};
            await handler(interaction, { path, params, query });
          }
        }
      } catch (error) {
        const path = 'error';
        const query = {};
        const params = {};

        for (const [regex, handler] of this.handlers.entries()) {
          if (regex.test(path)) {
            await handler(interaction, { path, params, query, error });
          }
        }
      }
    });
  }

  public command(
    command: SlashCommandInitialization,
    handler: InteractionHandler
  ) {
    this.commands.add([command, handler]);
  }

  public handler(path: RegExp, handler: InteractionHandler) {
    this.handlers.set(path, handler);
  }

  private readonly path = (interaction: Interaction): string => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        return `${interaction.commandName}`;

      case InteractionType.ModalSubmit:
      case InteractionType.MessageComponent:
        return `${interaction.customId}`;

      default:
        throw new Error(`Unknown interaction type ${interaction.type}`);
    }
  };

  private initializeCommandsOnGuild = async (guild: Guild) => {
    try {
      await guild.commands.set([]);

      for (const [command, handler] of this.commands.values()) {
        const commandResult = await command(guild);

        await guild.commands.create(commandResult);

        this.handler(new RegExp(`^${commandResult.name}$`), handler);

        console.log(
          `Command "/${commandResult.name}" initialized on ${guild.name}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
}
