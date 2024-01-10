import fs from 'fs';
import linebot from 'linebot';
import BaserowApi from './baserowApi.js';



export default class LineBotProcess {

        constructor(config) {
          this.baserowToken = config.baserowToken;
          this.channelId = config.channelId;
          this.bot = linebot(config);
          this.baserowApi = new BaserowApi();
      
          this.linebotParser = this.bot.parser();
      
          this.bot.on('message', this.handleMessage.bind(this));
        }
      
        handleMessage(event) {

          // if(this.validatorPayment(event)){
          //   event.reply('你還沒付錢～快去充值～吧～勇士們！');
          //   return;
          // }

          
          

          switch (event.message.type) {
            case 'text':
              this.handleTextMessage(event);
              break;
            case 'image':
              console.log(event);
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
            case 'follow':
                this.handleRegister(event);
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

        async validatorPayment(event) {
          try {
            const profile = await event.source.profile();
            const userId = profile.userId;
        
            const result = await this.baserowApi.getLineAccountPayment(this.baserowToken,userId,this.channelId);
            console.log('validatorPayment  result!!!!! , ',  result.length > 0);

            return result.length > 0
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }

        handleRegister(event) {
          
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
              this.bot.push( event.source.userId,
                    [{
                      "type": "bubble",
                      "hero": {
                        "type": "image",
                        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                          "type": "uri",
                          "uri": "http://linecorp.com/"
                        }
                      }
                    }]
                  )
              console.log('Success', event);

              // event.reply(event.message.text).then(function (data) {
              //   console.log('Success', data);
              // }).catch(function (error) {
              //   console.log('Error', error);
              // });
              break;
          }
        }
      
        handleImageMessage(event) {
          
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
        }

        

      }

      

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