
import express from 'express';
import LineBotProcess from './LineBotProcess.js';
import BaserowApi from './baserowApi.js';

// 在 localhost 走 8080 port
const app = express();
const baserowApi =new BaserowApi();


const botMap= new Map();

app.post('/api/initBot/:id', (req, res) => {
  const id = req.params.id;
   init(id);
  let responseData={
    'botMap':botMap
  }
  return res.send(responseData);
  
})


function init(id){
  baserowApi.getLineConfig(id).then((result) => {

    result.forEach(element => {
      const config = {
        'channelId':element.ChannelId,
        'channelSecret':element.ChannelSecret,
        'channelAccessToken':element.ChannelAccessToken,
        'baserowToken': id
      }

      if(!botMap.has(element.ChannelId)){
        const bot = new LineBotProcess(config );
        console.log("There new bot config data {}",config);
        botMap.set(element.ChannelId,bot)
        console.log("There new bot botMap data {}",botMap);
      }
    });
  })
}


app.post('/api/:id/callback', (req, res) => {
  const id = req.params.id;
  

  if(botMap.has(id)){
    const lineBotHandler = botMap.get(id)
    console.log("There new bot channelId data {}",id);

    lineBotHandler.linebotParser(req, res);
  }
  // linebotParser(req, res);
})

// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
    init("<-token for baseor->");
});