const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const dataquery = require('./helpers/dataquery')


const flowSaludo = addKeyword(['Argento']).addAction(async(ctx, {flowDynamic,gotoFlow}) => {
    //var telefono = ctx.key.remoteJid;
    var telefono = ctx.from;
    const client = await dataquery.getClient(telefono);
    console.log(client)
    if(client == false){
        return flowDynamic([{body:'Estimad@ cliente no parece estar registrado, complete el siguiente link,'},{body:'https://share.hsforms.com/15rYMpzpkTFeQoIq8hifa8geduv6'}])
    }
    var saludo = `🙌 Bienvenid@  ${client.nombre} ${client.apellido} llegaste a Gregoria Cocina`;

    await flowDynamic(saludo);
    return gotoFlow(flowMenu);
});

  
    const flowMenu = addKeyword(['menu'])
        .addAnswer(
        [        
        'Si escribís 👉 1 descargás la carta de terraza en PDF\n',
        'Si escribís 👉 2 te decimos la dirección y los horarios\n',
        'Si escribís 👉 3 conseguís el link para usar un descuento de BIENVENIDA!\n',
     //   'Si escribis 👉 4 Solo por problemas con el pedido o con el delivery\n',
        '🇦🇷 GREGORIA COCINA, LA REPÚBLICA DEL SABOR ARGENTO 🇦🇷',
        ], 
    );
 
    const flowMenuPDF = addKeyword('1').addAnswer(
        'Nuestra Carta Menu de terraza',{ media: 'https://bot.gregoria.cl/GREGORIA.pdf' },)
        .addAnswer('Si querés reservar mesa podés desde aca: https://acortar.link/OmsJMj',);

    const flowLocal = addKeyword('2').addAnswer(
        'Nosotros estamos en Vitacura!',
        ).addAnswer('en la AV Padre Hurtado Nº 1376 y la esquina con Las Hualtatas',
        ).addAnswer('tenemos un HORARIO EXTENDIDO.',
        ).addAnswer('de Martes a Sábados desde las 10.30 hasta las 19.00 hs',
        ).addAnswer('y los Domingos desde las 11.30 hasta las 14.00 hs; los Lunes descansamos',
      
    );
      const flowDelivery = addKeyword('3').addAnswer(
          'Podés pedir online https://mipedido.gregoria.cl/pedir',
          ).addAnswer('Te deja pedir delivery o que retires en el local',
          ).addAnswer('Al registrarte, en tus primeros 3 pedidos que hagas por la web TENÉS DESCUENTOS',
    );
        const flowprobDelivery = addKeyword('4').addAnswer(
          'Si tuviste problemas con el pago online y/o con el delivery :',
          ).addAnswer('Podes escribir la palabra *llamar*',
          ).addAnswer('encambio, si necesitas que te llamemos escribí *agendar*',
    );
    const flowLLamada = addKeyword('llamar').addAnswer('El teléfono de Gregoria Cocina es '+'54 9 7244 9202');    
    const flowAgendarLLamada =addKeyword('agendar').addAction(async(ctx, {flowDynamic,gotoFlow}) => {
        //var telefono = ctx.key.remoteJid;
        var telefono = ctx.from;
        const datoscliente = await dataquery.getClient(telefono);
        var cliente = `${datoscliente.nombre} ${datoscliente.apellido}`;
        dataquery.agendar(cliente,telefono).then(resp=>{
            return flowDynamic('Gracias por ser nuestr@ cliente favorit@, pronto te hablamos')
        })
      
    })     
    //    ----d

    const main = async () => {
    const adapterDB = new MockAdapter()
    //const adapterFlow = createFlow([flowMenu,flowMenuPDF,flowDelivery,flowprobDelivery,flowLocal])
    const adapterFlow = createFlow([flowSaludo,flowMenu,flowMenuPDF,flowDelivery,flowprobDelivery,flowLocal,flowLLamada,flowAgendarLLamada])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}
main()
