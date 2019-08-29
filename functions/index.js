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
          payload: `Respuesta ${respuesta.id}`
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
    }
]
return template
}

function getPersonaje(x){
    let ret = {
        nombre: "Thor",
        imagen: "https://i.kinja-img.com/gawker-media/image/upload/s--vwhuRp0h--/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/s1n7zkb1plbzle3pwhtf.jpg"
    }
    return ret;
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
 intentMap.set('Iniciar', agent => {
    if(agent.requestSource === 'FACEBOOK'){
        let items = []
        for(let i = 0; i < questions.length; i++){
            items.push(getCard(questions[i]))
        }
        let payload = new Payload('FACEBOOK', {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: items
                }
            }
        })
        agent.add(payload)
    }
    else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
    return agent
})
intentMap.set('Personaje', agent => {
   if(agent.requestSource === 'FACEBOOK'){
        let resultado = getResultado(getPersonaje(0))
        let payload = new Payload('FACEBOOK', resultado)
        agent.add(payload)
   }
   else agent.add("<speak>Escucha esto: <audio src='https://www.w3schools.com/html/horse.ogg'></audio></speak>")
   return agent
})
 agent.handleRequest(intentMap)
});
