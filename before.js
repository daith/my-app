import axios from 'axios';
import express from 'express';
import linebot from 'linebot';



let app = express();

let bot = linebot({
    channelId: '1653889652',
    channelSecret: 'b84a899c94948ec923bede4945a50051',
    channelAccessToken: '3jH0ZxMELS5Jmfh6v7Fa3Q+IDBp65LW3xfSiSA7X4LK71Onx68zEwzx4ZjF9tqHPfKeThlYpxRTIVywc5RNMoUC5eEEX/q4T5OVfsfqXfp6AGc/se/ZlythAQ4h8C86ZQtZIPiAG3ogFyuXqaO53kAdB04t89/1O/w1cDnyilFU=',
});

const linebotParser = bot.parser()

bot.on('message', function(event) {
    // 把收到訊息的 event 印出來
    // console.log(event);

    switch (event.message.type) {
      case 'text':
        switch (event.message.text) {
          case 'Me':
            event.source.profile().then(function (profile) {
              return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
            });
            break;
          case 'Member':
            event.source.member().then(function (member) {
              return event.reply(JSON.stringify(member));
            });
            break;
          case 'Picture':
            event.reply({
              type: 'image',
              originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
              previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
            });
            break;
          case 'Location':
            event.reply({
              type: 'location',
              title: 'LINE Plus Corporation',
              address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
              latitude: 13.7202068,
              longitude: 100.5298698
            });
            break;
          case 'Push':
            bot.push('U17448c796a01b715d293c34810985a4c', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
            break;
          case 'Push2':
            bot.push('Cba71ba25dafbd6a1472c655fe22979e2', 'Push to group');
            break;
          case 'Multicast':
            bot.push(['U17448c796a01b715d293c34810985a4c', 'Cba71ba25dafbd6a1472c655fe22979e2'], 'Multicast!');
            break;
          case 'Broadcast':
            bot.broadcast('Broadcast!');
            break;
          case 'Confirm':
            event.reply({
              type: 'template',
              altText: 'this is a confirm template',
              template: {
                type: 'confirm',
                text: 'Are you sure?',
                actions: [{
                  type: 'message',
                  label: 'Yes',
                  text: 'yes'
                }, {
                  type: 'message',
                  label: 'No',
                  text: 'no'
                }]
              }
            });
            break;
          case 'Multiple':
            return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
          case 'Total followers':
            bot.getTotalFollowers().then((result) => {
              event.reply('Total followers: ' + result.followers);
            });
            break;
          case 'Quota':
            bot.getQuota().then((result) => {
              event.reply('Quota: ' + result.value);
            });
            break;
          case 'Total reply':
            bot.getTotalReplyMessages().then((result) => {
              event.reply('Total reply messages: ' + result.success);
            });
            break;
          case 'Version':
            event.reply('linebot@' + require('../package.json').version);
            break;
          default:
            event.reply(event.message.text).then(function (data) {
              console.log('Success', data);
            }).catch(function (error) {
              console.log('Error', error);
            });
            break;
        }
        break;
      case 'image':
        event.message.content().then(function (data) {
          console.log(data);
          let rootDir = process.cwd()
          console.log("Current Directory"+ rootDir)
        
          let outDir = './out/';
          console.log("Out Directory"+ outDir)
        
          if (!fs.existsSync(outDir)){
              fs.mkdirSync(outDir);
          }else{
              console.log("Directory already exist");
          }
          saveArrayAsFile(data,  outDir+ "fileName"+ new Date().getTime()+".png")
  
          const s = data.toString('hex').substring(0, 32);
          return event.reply('Nice picture! ' + s);
        }).catch(function (err) {
          return event.reply(err.toString());
        });
        break;
      case 'video':
        event.reply('Nice video!');
        break;
      case 'audio':
        event.reply('Nice audio!');
        break;
      case 'location':
        event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
        break;
      case 'sticker':
        event.reply({
          type: 'sticker',
          packageId: 1,
          stickerId: 1
        });
        break;
      default:
        event.reply('Unknown message: ' + JSON.stringify(event));
        break;
    }
});

// app.post('/callback', linebotParser);

// app.post('/api/:id/callback', (req, res) => {
//     const id = req.params.id;
//     lineConfig(id,'CdVF1zWUYwq8y73pxxiyt2HhrD8FIf4o').then((element) => {

//         const config = {
//             'channelId':element.ChannelId,
//             'channelSecret':element.ChannelSecret,
//             'channelAccessToken':element.ChannelAccessToken
//           }
//           bot.channelId =element.channelId
//           bot.channelSecret =element.channelSecret
//           bot.channelAccessToken =element.channelAccessToken
//           console.log("My Line bot", bot);
//           linebotParser(req, res);
//         });
       
// })

app.post('/api/:id/callback', (req, res) => {
    console.log("There  bot  data {}",bot);

    bot.parser(req, res)
})

// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 3000, function() {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
});


const lineConfig = function(ChannelId,token){

    let url ='https://api.baserow.io/api/database/rows/table/224804/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "ChannelId", "type": "equal", "value": "#ChannelId#"}]}'
    url = url.replace("#ChannelId#", ChannelId)
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
       return response.data.results[0]
     });
   
   }
   