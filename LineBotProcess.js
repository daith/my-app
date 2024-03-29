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
      
        async  handleMessage(event) {
          let validatorResult =  await this.validatorPayment(event);
          console.log('validatorResult result    !!!!! , ',  validatorResult );
          if(!validatorResult){
          
            if(event.message.type === 'text'){
              let msg =  await this.checkPaymentCode(event);
               console.log('checkPaymentCode  msg !!!!! , ',  msg );
               if(msg  === 'CODE_ERROR'){
                event.reply('你還沒付錢。你輸入的確認碼有誤～快去充值～吧～勇士們！');
                return;
              } else if(msg  === 'CODE_IS_USE'){
                event.reply('你確定輸入的確認碼正確嗎？你還沒付錢～快去充值～吧～勇士們！');
                return;
              } else if(msg.startsWith("CODE_IS_CORRECT")){
                const id =  msg.split("CODE_IS_CORRECT_")[1];
                const handlePaymentFlowResult =  await this.handlePaymentFlow(event , id)
                if( !handlePaymentFlowResult){
                  event.reply('喔喔～付錢失敗～～快去找人幫忙～吧～勇士們！');
                  return;
                }else{
                  
                  await this.handleScriptByChannelIdAndInputKe(event , "Init" )
                  event.reply('付錢成功開始去玩吧～勇士們！');
                  return;

                }
              } else{
                event.reply('喔喔～你還沒付錢～快去充值～吧～勇士們！');
                return;
              }
            }else{
              event.reply('喔喔～你還沒付錢～快去充值～吧～勇士們！');
              return;
            }
          }else{
            
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
        }

        async validatorPayment(event) {
          try {
            const profile = await event.source.profile();
            const userId = profile.userId;
        
            const result = await this.baserowApi.getLineAccountPayment(this.baserowToken,userId,this.channelId);
            console.log('validatorPayment  result!!!!! , ',  result   ,  result.length > 0 , result.length > 0 && result[0]['LineId'] === userId);

            return result.length > 0 && result[0]['LineId'] === userId
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }

        async checkPaymentCode(event) {
          try {
            const code = event.message.text;
        
            const result = await this.baserowApi.getPaymentCode(this.baserowToken,code,this.channelId);
            
            
            console.log('checkPaymentCode  result !!!!! , ',  result );
            if(result.length == 0){
              return 'CODE_ERROR';
            } else if(result.length != 0 &&  result[0]['LineId'] !=''){
              return 'CODE_IS_USE';
            } else {
              const id =result[0]['id'];
              console.log('checkPaymentCode  result[0][id] !!!!! , ',   id);
              return 'CODE_IS_CORRECT'+'_'+id;
            }
            
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }

        async handleScriptByChannelIdAndInputKe(event , inputKey ) {
          try {
            let result = await this.baserowApi.getScriptByChannelIdAndInputKey(this.baserowToken, this.channelId , inputKey)
            const profile = await event.source.profile();
            const displayName = profile.displayName;
            const userId = profile.userId;
            const token = this.baserowToken;
            const channelId = this.channelId;

            let gameAccountData = {};

            

            if(result.length == 0){
              result =await this.getRandomSentence(token, channelId , "WrongAnswer")
            }

              // await this.initAccountGameInfo(event , "Init" )
              if(inputKey === "Init"){
                gameAccountData =  await this.handleInitGameAccountInfo(token, channelId , userId , result[0]["Chapter"] ,  result[0]["Scenes"] )
              }else{
                let gameDataValueResult = await this.baserowApi.getAccountGameInfo(token, channelId , userId)
                console.log("There gameDataValueResult" , gameDataValueResult)
                if(gameDataValueResult.length == 0){
                  gameAccountData =  await this.handleInitGameAccountInfo(token, channelId , userId , result[0]["Chapter"] ,result[0]["Scenes"])
                }else{
                  gameAccountData  = gameDataValueResult[0]
                }
              }

            // send init script
            let OutPutMsgArr = []
            console.log("There result[0]" , result[0]["Scenes"] != "-1" , result[0]["Chapter"]+"_"+ result[0]["Scenes"]  ,gameAccountData["Chapter"]+"_"+gameAccountData["Scenes"] )
            
            if(result[0]["Scenes"] != "-1" && result[0]["Chapter"]+"_"+ result[0]["Scenes"] != gameAccountData["Chapter"]+"_"+gameAccountData["Scenes"] ){
              let historyData = await this.baserowApi.getGameHistory(token, channelId , userId , result[0]["Chapter"] )
              historyData.sort((a, b) => parseInt(a.Scenes) - parseInt(b.Scenes));
              const lastLog = historyData.slice(-1);

              console.log("There historyData , " , historyData)

    
              if(  historyData.length == 0 && result[0].Scenes!=1 ){
                result = await this.getRandomSentence(token, channelId , "WrongAnswer")
              }
              else if(historyData.length != 0 && parseInt( lastLog[0].Scenes) >  parseInt( result[0].Scenes)){
                result =await this.getRandomSentence(token, channelId , "GameIsDone")

              }else if(historyData.length != 0 && (parseInt( result[0].Scenes) - parseInt( lastLog[0].Scenes) >1 )){
                result = await this.getRandomSentence(token, channelId , "WrongAnswer")

              }
            }

            for (const scriptRecord of result) {
              
              const messageType = scriptRecord['LinMsgType'];
              let OutPutMsg = scriptRecord['OutPutMsg'].replace("#UserName#", displayName);
              let content={};
              switch (messageType) {
                case 'flex':
                  content  = 
                        {
                          "type": "flex",
                          "altText": "this is a flex message",
                          "contents":JSON.parse(OutPutMsg)
                      }
                    OutPutMsgArr.push(content);
                    break;
                case 'text':
                  content = 
                          {			
                            "type":"text",	
                            "text":OutPutMsg         		
                          }
                      OutPutMsgArr.push(content);
                      break;
                case 'image':
                        content = 
                            {
                              "type": "image",
                              "originalContentUrl": OutPutMsg,
                              "previewImageUrl": OutPutMsg
                            }
                            OutPutMsgArr.push(content);
                            break;
                case 'video':
                        let data = JSON.parse(OutPutMsg)
                            console.log("originalContentUrl   " , data)
                        content = 
                        {
                          "type": "video",
                          "originalContentUrl": data['originalContentUrl'],
                          "previewImageUrl": (data['previewImageUrl']? data['previewImageUrl']:""),
                          "trackingId": "track-id-"+userId
                        }
                        OutPutMsgArr.push(content);
                        break;
                 case 'audio':
                          content = 
                          {
                            "type": "audio",
                            "originalContentUrl": OutPutMsg,
                            "duration": 60000
                          }
                          OutPutMsgArr.push(content);
                          break;        
                default:
                        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
                }
            }

            this.handleSendMessage(OutPutMsgArr , event   ) 

            if(result[0]["Scenes"] != "-1" && result[0]["Chapter"]+"_"+ result[0]["Scenes"] != gameAccountData["Chapter"]+"_"+gameAccountData["Scenes"] ){
              this.updateGameAccountInfo(token, channelId , userId , result[0]["Chapter"], result[0]["Scenes"] , gameAccountData["id"])

            }
            
            } catch (error) {
              console.error('An error occurred:', error);
            }
          
        }

        async handlePaymentFlow(event , rowId) {
          try {
            const profile = await event.source.profile();
            const userId = profile.userId;
              let data = {
                'LineId':userId
              }
              console.log('handlePaymentFlow  rowId !!!!! , ',  rowId );
              const result = await this.baserowApi.paymentCodeBinding(this.baserowToken,rowId,data);

              console.log('handlePaymentFlow  result !!!!! , ',  result );
              return result['LineId'] === userId;
              
            } catch (error) {
              console.error('An error occurred:', error);
            }
          
        }

        async handleSendMessage(scriptRecords , event   ) {
          console.log('handleSendMessage  result !!!!! , ',  scriptRecords );
          this.bot.push( event.source.userId,scriptRecords  )
        }
        
        async handleTextMessage(event) {
          let userMsg = event.message.text ;
          this.handleScriptByChannelIdAndInputKe(event , userMsg )
        }
      
        async handleImageMessage(event) {
          
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

        async handleInitGameAccountInfo(token, channelId , lineId , chapter, scenes){
              let gameDataValueResult = await this.baserowApi.getAccountGameInfo(token , channelId , lineId)
              let gameData = {
                "ChannelId": channelId,
                "LineId": lineId,
                "Chapter": chapter,
                "Scenes": scenes,
            }
            console.log('handleInitGameAccountInfo  result !!!!! , ',  gameDataValueResult );

              if(gameDataValueResult.length == 0){
                
                let gameDataValueData = await this.baserowApi.createAccountGameInfo(token, gameData);
                return gameDataValueData;
              }else {
                let gameDataValueData = await this.baserowApi.updateAccountGameInfo(token, gameDataValueResult[0]["id"] , gameData)
                return gameDataValueData;
              }
        }

        async updateGameAccountInfo(token, channelId , lineId , chapter, scenes  , rowId){
          let gameData = {
            "ChannelId": channelId,
            "LineId": lineId,
            "Chapter": chapter,
            "Scenes": scenes,
        }

        
        let updateAccountGameInfo = await this.baserowApi.updateAccountGameInfo(token, rowId , gameData)

        let createGameHistory = await  this.baserowApi.createGameHistory(token, gameData)

        }

        async getRandomSentence(token, channelId , sentenceKey){

          let defaultMsg = await this.baserowApi.getScriptByChannelIdAndInputKey(token, channelId, sentenceKey)
          const index = Math.floor(Math.random() * defaultMsg.length)
          return [defaultMsg[index]] 
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