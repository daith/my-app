import axios from 'axios';
import express from 'express';
import LineBotProcess from './LineBotProcess.js';


// 在 localhost 走 8080 port
const app = express();


const botMap= new Map();

app.post('/api/initBot/:id', (req, res) => {
  const id = req.params.id;

  lineConfig(id).then((result) => {

    result.forEach(element => {
      const config = {
        'channelId':element.ChannelId,
        'channelSecret':element.ChannelSecret,
        'channelAccessToken':element.ChannelAccessToken
      }

      if(!botMap.has(element.ChannelId)){
        const bot = new LineBotProcess(config );
        console.log("There new bot config data {}",config);
        botMap.set(element.ChannelId,bot)
        console.log("There new bot botMap data {}",botMap);
      }
    });

    let responseData={
      'botMap':botMap
    }
    return res.send(responseData);

    
  })
})



app.post('/api/:id/callback', (req, res) => {
  const id = req.params.id;
  console.log("There new bot channelId data {}",id);

  if(botMap.has(id)){
    const lineBotHandler = botMap.get(id)
    lineBotHandler.linebotParser(req, res);
  }
  // linebotParser(req, res);
})

// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
});


const lineConfig = function(token){

 const url ='https://api.baserow.io/api/database/rows/table/224804/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "Active", "type": "equal", "value": "1"}]}'
 let header_info= 'Token #token#'
 header_info = header_info.replace("#token#", token)
  console.log("There was an url---> {}",url);


  return axios({
    method: "get",
    url: url,
    headers: {
      Authorization: header_info,
    },
  }).then((response) => {
    return response.data.results
  });

}
