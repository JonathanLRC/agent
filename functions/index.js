const functions = require('firebase-functions');
const { Payload, WebhookClient, Suggestion } = require('dialogflow-fulfillment')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

let questions = require('./questions.json')
const getCard = respuesta => {
    let template = {
      title: respuesta.title,
      subtitle: respuesta.subtitle,
      image_url: respuesta.image_url,
      buttons: [
        {
          type: "postback",
          title: "Seleccionar",
          payload: respuesta.payload
        }
      ]
    }
    return template
  }

const getResultado = resultado => {
let template = [
    {
        attachment: {
            type: "image",
            payload: {
                url: resultado.imagen
            }
        }
    },
    {
        text: "Eres:\n" + resultado.nombre
    },
    {
        text: resultado.descripcion
    }
]
return template
}

exports.fulfilment = functions.https.onRequest((request, response) => {
 const agent = new WebhookClient({ request, response});
 let intentMap = new Map();
 intentMap.set('Servicios', agent => {
     if(agent.requestSource === 'FACEBOOK'){
        agent.add(new Suggestion("Reparaciones"))
        agent.add(new Suggestion("Entrega"))
     }
     else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
     return agent
 })
 intentMap.set('Iniciar', agent => { // Pregunta colores
    if(agent.requestSource === 'FACEBOOK'){
        let items = []
        for(let i = 0; i < questions["colors"].length; i++){
            items.push(getCard(questions["colors"][i]))
        }
        let payload = new Payload('FACEBOOK', [
            {
                text: "Responde a las siguientes preguntas para saber cuál vengador eres:"
            },
            {
                text: "¿Cuál es tu color favorito?"
            },
            {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: items
                    }
                } 
            }
        ])
        agent.add(payload)
    }
    else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
    return agent
})
intentMap.set('Color', agent => { // Pregunta comidas
   if(agent.requestSource === 'FACEBOOK'){
        agent.context.set({
        'name':'color',
        'lifespan': 5,
        'parameters':{
            'choosen-color':agent.parameters['Colores']
            }
        });
       let items = []
       for(let i = 0; i < questions["foods"].length; i++){
           items.push(getCard(questions["foods"][i]))
       }
       let payload = new Payload('FACEBOOK', [
           {
               text: "¿Cuál es tu comida favorita?"
           },
           {
               attachment: {
                   type: "template",
                   payload: {
                       template_type: "generic",
                       elements: items
                   }
               } 
           }
       ])
       agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
intentMap.set('Food', agent => { // Pregunta animales
   if(agent.requestSource === 'FACEBOOK'){
        agent.context.set({
        'name':'food',
        'lifespan': 5,
        'parameters':{
            'choosen-food': agent.parameters['Comidas']
            }
        });
       let items = []
       for(let i = 0; i < questions["animals"].length; i++){
           items.push(getCard(questions["animals"][i]))
       }
       let payload = new Payload('FACEBOOK', [
           {
               text: "¿Cuál es tu animal favorito?"
           },
           {
               attachment: {
                   type: "template",
                   payload: {
                       template_type: "generic",
                       elements: items
                   }
               } 
           }
       ])
       agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
intentMap.set('Animal', agent => { // Pregunta climas
   if(agent.requestSource === 'FACEBOOK'){
        agent.context.set({
        'name':'animal',
        'lifespan': 5,
        'parameters':{
            'choosen-animal': agent.parameters['Animales']
            }
        });
       let items = []
       for(let i = 0; i < questions["weathers"].length; i++){
           items.push(getCard(questions["weathers"][i]))
       }
       let payload = new Payload('FACEBOOK', [
           {
               text: "¿Qué clima prefieres?"
           },
           {
               attachment: {
                   type: "template",
                   payload: {
                       template_type: "generic",
                       elements: items
                   }
               } 
           }
       ])
       agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
intentMap.set('Clima', agent => { // Pregunta emociones
   if(agent.requestSource === 'FACEBOOK'){
        agent.context.set({
        'name':'weather',
        'lifespan': 5,
        'parameters':{
            'choosen-weather': agent.parameters['Climas']
            }
        });
       let items = []
       for(let i = 0; i < questions["emotions"].length; i++){
           items.push(getCard(questions["emotions"][i]))
       }
       let payload = new Payload('FACEBOOK', [
           {
               text: "¿Cómo te sientes regularmente?"
           },
           {
               attachment: {
                   type: "template",
                   payload: {
                       template_type: "generic",
                       elements: items
                   }
               } 
           }
       ])
       agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
intentMap.set('Emocion', agent => { // Da resultado
   if(agent.requestSource === 'FACEBOOK'){
        agent.context.set({
        'name':'emotion',
        'lifespan': 5,
        'parameters':{
            'choosen-emotion': agent.parameters['Emociones']
            }
        });
       //agent.add("OK, "+agent.context.get('color')['parameters']['choosen-color']+
       //" "+agent.context.get('food')['parameters']['choosen-food']+
       //" "+agent.context.get('animal')['parameters']['choosen-animal']+
       //" "+agent.context.get('weather')['parameters']['choosen-weather']+
       //" "+agent.context.get('emotion')['parameters']['choosen-emotion']);
       let resultado = getResultado(getPersonaje(agent.context))
       let payload = new Payload('FACEBOOK', resultado)
       agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
intentMap.set('Debug', agent => {
    if(agent.requestSource === 'FACEBOOK'){
        agent.add(JSON.stringify(agent.parameters))
    }
    else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
    return agent
})
intentMap.set('Personaje', agent => {
   if(agent.requestSource === 'FACEBOOK'){
        let resultado = getResultado(questions['personajes'][0])
        let payload = new Payload('FACEBOOK', resultado)
        agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
 agent.handleRequest(intentMap)
});

function getPersonaje(x){
    var ironman=0, capamerica=0, hulk=0, blackwidow=0;
    switch(x.get('color')['parameters']['choosen-color']){
        case 'rojo':
            ironman++;
            break;
        case 'azul':
            capamerica++;
            break;
        case 'verde':
            hulk++;
            break;
        case 'negro':
            blackwidow++;
            break;
    }
    switch(x.get('food')['parameters']['choosen-food']){
        case 'pizza':
            ironman++;
            break;
        case 'tacos':
            hulk++;
            break;
        case 'buffalo wings':
            blackwidow++;
            break;
        case 'pesto eggs':
            capamerica++;
            break;
    }
    switch(x.get('animal')['parameters']['choosen-animal']){
        case 'gato':
            ironman++;
            break;
        case 'perro':
            capamerica++;
            break;
        case 'pez':
            hulk++;
            break;
        case 'ave':
            blackwidow++;
            break;
    }
    switch(x.get('weather')['parameters']['choosen-weather']){
        case 'soleado':
            capamerica++;
            break;
        case 'lluvioso':
            ironman++;
            break;
        case 'nublado':
            blackwidow++;
            break;
        case 'granizando':
            hulk++;
            break;
    }
    switch(x.get('emotion')['parameters']['choosen-emotion']){
        case 'feliz':
            ironman++;
            break;
        case 'triste':
            capamerica++;
            break;
        case 'furioso':
            hulk++;
            break;
        case 'serio':
            blackwidow++;
            break;
    }
    var ret;
    if(ironman >= capamerica && ironman >= hulk && ironman >= blackwidow){
        ret = questions['personajes'][0];
    }else if(capamerica >= ironman && capamerica >= hulk && capamerica >= blackwidow){
        ret = questions['personajes'][1];
    }else if(hulk >= ironman && hulk >= capamerica && hulk >= blackwidow){
        ret = questions['personajes'][2];
    }else if(blackwidow >= ironman && blackwidow >= capamerica && blackwidow >= hulk){
        ret = questions['personajes'][3];
    }
    return ret;
}