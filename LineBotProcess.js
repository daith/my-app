import linebot from 'linebot';



export default class LineBotProcess {

        constructor(config) {
          this.bot = linebot(config);
      
          this.linebotParser = this.bot.parser();
      
          this.bot.on('message', this.handleMessage.bind(this));
        }
      
        handleMessage(event) {
          switch (event.message.type) {
            case 'text':
              this.handleTextMessage(event);
              break;
            case 'image':
              this.handleImageMessage(event);
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
        }
      
        handleTextMessage(event) {
          switch (event.message.text) {
            case 'Me':
              event.source.profile().then(function (profile) {
                return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
              });
              break;
            // 其他 text message 的處理邏輯
            default:
              event.reply(event.message.text).then(function (data) {
                console.log('Success', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
              break;
          }
        }
      
        handleImageMessage(event) {
          event.message.content().then(function (data) {
            // 圖片處理邏輯
          }).catch(function (err) {
            return event.reply(err.toString());
          });
        }
      }