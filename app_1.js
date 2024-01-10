var linebot = require('linebot');
var fs = require('fs');


// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1653889652',
  channelSecret: 'b84a899c94948ec923bede4945a50051',
  channelAccessToken: '3jH0ZxMELS5Jmfh6v7Fa3Q+IDBp65LW3xfSiSA7X4LK71Onx68zEwzx4ZjF9tqHPfKeThlYpxRTIVywc5RNMoUC5eEEX/q4T5OVfsfqXfp6AGc/se/ZlythAQ4h8C86ZQtZIPiAG3ogFyuXqaO53kAdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function (event) {
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

bot.on('follow', function (event) {
  event.reply('follow: ' + event.source.userId);
  // register account info
});

bot.on('unfollow', function (event) {
  event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
  if(event.source.groupId) {
    event.reply('join group: ' + event.source.groupId);
  }
  if(event.source.roomId) {
    event.reply('join room: ' + event.source.roomId);
  }
});

bot.on('leave', function (event) {
  if(event.source.groupId) {
    console.log('leave group: ' + event.source.groupId);
  }
  if(event.source.roomId) {
    console.log('leave room: ' + event.source.roomId);
  }
});

bot.on('memberJoined', function (event) {
  event.source.profile().then(function (/*profile*/) {
    if(event.source.type === 'group') {
      event.reply('memberJoined: Welcome to the group.');
    }
    if(event.source.type === 'room') {
      event.reply('memberJoined: Welcome to the room.');
    }
  });
});

bot.on('memberLeft', function (/*event*/) {
  console.log('memberLeft: Goodbye.');
});

bot.on('postback', function (event) {
  event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
  event.reply('beacon: ' + event.beacon.hwid);
});

// 當有人傳送訊息給Bot時
bot.on('follow', function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者

  var replyMsg  = `Hello你剛才說的是:${event.message.text}`;
  event.reply(replyMsg).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
});

// Bot所監聽的webhook路徑與port
bot.listen('/callback', 3000, function () {
    console.log('[BOT已準備就緒]');
});

const saveArrayAsFile =  (arrayBuffer, filePath)=> {
  fs.writeFile(filePath, Buffer.from(arrayBuffer), 'binary',  (err)=> {
      if (err) {
          console.log("There was an error writing the image")
      }
      else {
          console.log("Written File :" + filePath)
      }
  });
};