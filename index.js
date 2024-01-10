import { Client, middleware } from '@line/bot-sdk';
import express from 'express';
import BaserowApi from './baserowApi.js';
import { carousel, imageMap } from './template.js';



const app = express();
const baserowApi = new BaserowApi();
const botMap = new Map();

async function init(id) {
    try {
      const configResult = await baserowApi.getLineConfig(id);
      configResult.forEach(element => {
        const lineConfig = {
          channelId: element.ChannelId,
          channelSecret: element.ChannelSecret,
          channelAccessToken: element.ChannelAccessToken,
          baserowToken: id
        };
  
        if (!botMap.has(element.ChannelId)) {
          const client = new Client(lineConfig);
          botMap.set(element.ChannelId, { lineConfig, client });
        }
      });
    } catch (error) {
      console.error('Error initializing bot configurations:', error);
    }
  }

let userId, userName, userPictureUrl; //getProfile用

app.post('/api/:id/callback', (req, res) => {
    const botConfig = botMap.get(req.params.id);
    if (!botConfig) {
      console.error('Bot configuration not found for ID:', req.params.id);
      return res.status(404).send('Bot configuration not found');
    }
    const client = botConfig.client;
  
    middleware(botConfig.lineConfig)(req, res, async () => {
      try {
        const profile = await client.getProfile(req.body.events[0].source.userId);
        const userId = profile.userId;
        const userName = profile.displayName;
        const userPictureUrl = profile.pictureUrl;
  
        const eventResults = req.body.events.map(event => 
          handleEvent(event, client, userId, userName, userPictureUrl)
        );
        
        // You might want to wait for all events to be handled (e.g., with Promise.all)
        await Promise.all(eventResults);
        res.status(200).send('OK');
      } catch (err) {
        console.error('Error in processing request:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });

  function handleEvent(event, client, userId, userName, userPictureUrl) {
    switch (event.type) {
            case 'message': //傳訊息給機器人
                const message = event.message
                const replyToken = event.replyToken
                switch (message.type) {
                    case 'text':
                        textHandler(replyToken, event.message.text , client , userId, userName, userPictureUrl);
                        return;
                    case 'image':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send a image.'
                    })
                    case 'video':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send a video.'
                    })
                    case 'audio':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send an audio.'
                    })
                    case 'file':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send an file.'
                    })
                    case 'location':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send a location.'
                    })
                    case 'sticker':
                    return client.replyMessage(replyToken, {
                        type: 'text', text: 'you send a sticker.'
                    })
                    default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
                }

            case 'follow': //追蹤
            // console.log(JSON.stringify(event));
            return client.replyMessage(replyToken, {
                type: 'text',
                text: `我知道你是誰喔，你的id是${event.source.userId}\n\n你在${Date(event.timestamp)}加我為好友`
                });   


            case 'unfollow':
            return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

            case 'join': //加入別人的群組
            return replyText(replyToken, `Joined ${event.source.type}`);

            case 'leave':
            return console.log(`Left: ${JSON.stringify(event)}`);

            case 'memberJoined':
            return replyText(replyToken, `memberJoined ${event.source.type}`);

            case 'memberLeft':
            return console.log(`memberLeft: ${JSON.stringify(event)}`);

            case 'postback':
            let data = event.postback.data;
            if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
                data += `(${JSON.stringify(event.postback.params)})`;
            }
            return replyText(replyToken, `Got postback: ${data}`);

            case 'beacon':
            return replyText(replyToken, `Got beacon: ${event.beacon.hwid}`);

            default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);

        }
  }
  


const textHandler = (replyToken, inputText , client , userId, userName, userPictureUrl) => {
    try{
        let resText;
        switch (inputText) {
            case '你好':
                resText = '你好啊';
                break;
            case 'test':
                resText = `測試`;
                break
            case 'Q&A':
                return client.pushMessage(userId, imageMap());
            case 'q&a':
                return client.replyMessage(replyToken, carousel());
            case '我是誰':
                resText = `你的id為: ${userId}\n你的名字為: ${userName}\n你的照片為: ${userPictureUrl}`;
                break;
            default:
                resText = '請親臨院所';
        }
        return client.replyMessage(replyToken, {
            type: 'text',
            text: resText
        });
    } catch (err) {
        console.log(err)
    }

}


// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
    init("CdVF1zWUYwq8y73pxxiyt2HhrD8FIf4o");
});