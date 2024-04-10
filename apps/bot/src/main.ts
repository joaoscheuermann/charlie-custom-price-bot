import assert from 'assert';
import {
  Client,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  SlashCommandBuilder,
} from 'discord.js';
import { Slash } from '@charlinho/slash';

import * as api from '@charlinho/api';
import moment from 'moment';

assert(
  process.env.DISCORD_BOT_TOKEN,
  'process.env.DISCORD_BOT_TOKEN is required'
);

const client = new Client({
  partials: [Partials.Channel, Partials.Message],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

const slash = new Slash(client);

slash.command(
  async () =>
    new SlashCommandBuilder()
      .setName('reserva')
      .setDescription(
        'Charlinho vai iniciar o processo de reserva com as informações enviadas!'
      )
      .addStringOption((option) =>
        option
          .setName('url')
          .setDescription('url of `/pagamento` page')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('firstname')
          .setDescription('your first name')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('lastname')
          .setDescription('your last name')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName('email').setDescription('your email').setRequired(true)
      )
      .addStringOption((option) =>
        option.setName('phone').setDescription('your phone').setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('birthday')
          .setDescription('your birthday')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('document')
          .setDescription('CPF')
          .setDescription('your CPF')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('value')
          .setDescription('value you want to pay (R$)')
          .setRequired(true)
      ),

  async (interaction: CommandInteraction) => {
    await interaction.reply({
      content: '',
      embeds: [
        new EmbedBuilder()
          .setTitle('Validando dados...')
          .setDescription('Aguarde enquanto processamos seus dados')
          .setColor(Colors.Yellow),
      ],
      ephemeral: true,
    });

    const availableInputProperties = [
      'url',
      'firstname',
      'lastname',
      'email',
      'phone',
      'birthday',
      'document',
      'value',
    ];

    const missingInputProperties = availableInputProperties.filter(
      (property) => !interaction.options.get(property)
    );

    if (missingInputProperties.length) {
      await interaction.editReply({
        content: `Você não enviou as seguintes propriedades: ${missingInputProperties.join(
          ', '
        )}`,
        embeds: [],
      });

      return;
    }

    const inputUrl = interaction.options.get('url');
    const inputFirstName = interaction.options.get('firstname');
    const inputLastName = interaction.options.get('lastname');
    const inputEmail = interaction.options.get('email');
    const inputPhone = interaction.options.get('phone');
    const inputBirthday = interaction.options.get('birthday');
    const inputDocument = interaction.options.get('document');
    const inputValue = interaction.options.get('value');

    const url = new URL(inputUrl.value as string);

    if (url.hostname !== 'www.staycharlie.com.br') {
      await interaction.editReply({
        content:
          'A url enviada não é do site do Charlie! Por favor use o comando `/help` para instruções detalhadas!',
        embeds: [],
      });

      return;
    }

    if (url.pathname !== '/pagamento') {
      await interaction.editReply({
        content:
          'A url enviada não é da tela de pagamento. Por favor use o comando `/help` para instruções detalhadas!',
        embeds: [],
      });

      return;
    }

    if (!/^.+$/.test(inputFirstName.value as string)) {
      await interaction.editReply({
        content: 'Nome inválido!',
        embeds: [],
      });

      return;
    }

    if (!/^.+$/.test(inputLastName.value as string)) {
      await interaction.editReply({
        content: 'Sobrenome inválido!',
        embeds: [],
      });

      return;
    }

    if (!/^\d{11}$/.test(inputPhone.value as string)) {
      await interaction.editReply({
        content: 'Telefone inválido!',
        embeds: [],
      });

      return;
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        inputEmail.value as string
      )
    ) {
      await interaction.editReply({
        content: 'Email inválido!',
        embeds: [],
      });

      return;
    }

    if (!/^\d{8}$/.test(inputBirthday.value as string)) {
      await interaction.editReply({
        content: 'Data de nascimento inválida!',
        embeds: [],
      });

      return;
    }

    if (!/^\d{11}$/.test(inputDocument.value as string)) {
      await interaction.editReply({
        content: 'CPF inválido!',
        embeds: [],
      });

      return;
    }

    if (!/^\d+\.\d{2}$/.test(inputValue.value as string)) {
      await interaction.editReply({
        content: 'Valor inválido (Use virgula para separar os centavos)!',
        embeds: [],
      });

      return;
    }

    /**
     * Check if the URL contains the required properties
     */
    const missingProperty = [
      'city',
      'start_date',
      'end_date',
      'guests',
      'building_id',
      'category_id',
    ].find((property) => !url.searchParams.has(property));

    if (missingProperty) {
      await interaction.editReply({
        content: `A URL enviada não contém a propriedade \`${missingProperty}\`. Por favor use o comando \`/help\` para instruções detalhadas!`,
        embeds: [],
      });

      return;
    }

    const city = url.searchParams.get('city');
    const start_date = url.searchParams.get('start_date');
    const end_date = url.searchParams.get('end_date');
    const guests = parseInt(url.searchParams.get('guests'));
    const building_id = url.searchParams.get('building_id');
    const category_id = url.searchParams.get('category_id');

    const req = await api.rooms.getAvailability({
      city,
      start_date,
      end_date,
      guests,
    });

    const buildings = Object.values(await req.json()) as api.LegacyBuilding[];

    const building = buildings.find(
      (building) => building.property_id === building_id
    );

    if (!building) {
      await interaction.editReply({
        content: 'Prédio não encontrado!',
        embeds: [],
      });

      return;
    }

    const room = building.room_types.find(
      (category) => category.room_type_id === category_id
    );

    if (!room) {
      await interaction.editReply({
        content: 'Quarto não encontrado!',
        embeds: [],
      });

      return;
    }

    if (!room.available_units) {
      await interaction.editReply({
        content: 'O quarto não está mais disponível!',
        embeds: [],
      });

      return;
    }

    await interaction.editReply({
      content: '',
      embeds: [
        new EmbedBuilder()
          .setTitle('Realizando reserva...')
          .setDescription('Seu quarto está sendo reservado!')
          .setColor(Colors.Orange),
      ],
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const paymentPayload: api.payment.CreatePaymentBody = {
      name: inputFirstName.value as string,
      surname: inputLastName.value as string,
      email: inputEmail.value as string,
      cpfnumber: inputDocument.value as string,
      birthdate: moment(inputBirthday.value as string, 'DDMMYYYY').format(
        'YYYY-MM-DD'
      ),
      cellphone: inputPhone.value as string,
      country: 'BR',
      roomtype_id: room.room_type_id,
      start_date,
      end_date,
      units: 1,
      guests,
      coupon_code: '',
      custom_price: parseFloat(inputValue.value as string) * 100,
      has_cleaning_fee: false,
      cardName: '',
      cardNumber: '',
      cardSecurityCode: '',
      cardExpiryDate: '',
      option: 'pix',
      addressCEP: '',
      address: '',
      addressNumber: '',
      addressComplement: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      pre_booking_code: null,
      referral: 'site',
      campaign: '',
    };

    const simulation = await api.payment.simulate(paymentPayload);

    if (simulation.status !== 200) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Erro ao realizar reserva!')
            .setDescription('Parece que não conseguimos simular o pagamento :(')
            .setColor(Colors.Red),
        ],
      });

      return;
    }

    const creation = await api.payment.create(paymentPayload);

    if (creation.status !== 200) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Erro ao realizar reserva!')
            .setDescription('Parece que não conseguimos criar o pagamento :(')
            .setColor(Colors.Red),
        ],
      });

      return;
    }

    const { data: creationData } = await creation.json();
    const { data: simulationData } = await simulation.json();

    const totalPrice = simulationData.TotalPrice / 100;
    const originalPrice = simulationData.OriginalPrice / 100;
    const discount = ((originalPrice - totalPrice) * 100) / originalPrice;

    const formatedTotalPrice = totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const formatedOriginalPrice = originalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const formatedDiscount = discount.toFixed(2) + ' %';

    const paymentPendingEmbed = new EmbedBuilder()
      .setTitle(
        `Reserva ${creationData.external_id} do quarto ${simulationData.RoomType.type} no ${simulationData.RoomType.property.name} em ${simulationData.RoomType.property.city} foi solicitada!`
      )
      .setURL(`https://www.staycharlie.com.br/tr/${creationData.order_id}`)
      .setDescription(
        `Agora é só pagar o QR code a baixo para confirmar sua reserva, ele expira em uma hora!`
      )
      .addFields(
        {
          name: 'Código da reserva',
          value: creationData.external_id,
        },
        {
          name: 'PIX Copia e cola',
          value: `\`${creationData.qr_code}\``,
        },
        {
          name: 'Valor Total',
          value: formatedTotalPrice,
          inline: true,
        },
        {
          name: 'Valor Original',
          value: formatedOriginalPrice,
          inline: true,
        },
        {
          name: 'Desconto',
          value: formatedDiscount,
          inline: true,
        },
        {
          name: 'Checkin',
          value: moment(start_date).format('DD/MM/YYYY') + ' 15:00',
          inline: true,
        },
        {
          name: 'Checkout',
          value: moment(end_date).format('DD/MM/YYYY') + ' 11:00',
          inline: true,
        }
      )
      .setImage(creationData.qr_code_url)
      .setColor(Colors.Yellow);

    const paymentSuccessEmbed = new EmbedBuilder()
      .setTitle(
        `Reserva do quarto ${simulationData.RoomType.type} no ${simulationData.RoomType.property.name} em ${simulationData.RoomType.property.city} paga e confirmada!`
      )
      .setURL(
        `https://in.staycharlie.com.br/?reserva=${creationData.external_id}`
      )
      .setDescription(
        `O pagamento data reserva **${creationData.external_id}** foi realizado com sucesso! Agora é só esperar a confirmação da sua reverva e fazer o check-in!`
      )
      .addFields(
        {
          name: 'Código da reserva',
          value: creationData.external_id,
        },
        {
          name: 'PIX Copia e cola',
          value: `\`${creationData.qr_code}\``,
        },
        {
          name: 'Valor Total',
          value: formatedTotalPrice,
          inline: true,
        },
        {
          name: 'Valor Original',
          value: formatedOriginalPrice,
          inline: true,
        },
        {
          name: 'Desconto',
          value: formatedDiscount,
          inline: true,
        },
        {
          name: 'Checkin',
          value: moment(start_date).format('DD/MM/YYYY') + ' 15:00',
          inline: true,
        },
        {
          name: 'Checkout',
          value: moment(end_date).format('DD/MM/YYYY') + ' 11:00',
          inline: true,
        }
      )
      .setColor(Colors.Green);

    const paymentExpiredEmbed = new EmbedBuilder()
      .setTitle('Pagamento Expirado!')
      .setDescription('O pagamento expirou, por favor tente novamente!')
      .setColor(Colors.Red);

    await interaction.editReply({
      embeds: [paymentPendingEmbed],
    });

    const message = await interaction.user.send({
      embeds: [paymentPendingEmbed],
    });

    const timer = setInterval(async () => {
      const payment = await api.payment.check(creationData.order_id);

      if (payment.status !== 200) {
        return;
      }

      const { data: payments } = await payment.json();

      const [paymentData] = payments;

      if (paymentData.IsPaid && !paymentData.is_expired) {
        clearInterval(timer);

        await message.edit({
          embeds: [paymentSuccessEmbed],
        });

        await interaction.editReply({
          embeds: [paymentSuccessEmbed],
        });
      } else if (paymentData.is_expired) {
        clearInterval(timer);

        await message.edit({
          embeds: [paymentExpiredEmbed],
        });

        await interaction.editReply({
          embeds: [paymentExpiredEmbed],
        });
      }
    }, 15000);
  }
);

slash.handler(/^error$/, async (interaction, { error }) => {
  console.log(error);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
