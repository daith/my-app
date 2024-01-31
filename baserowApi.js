import axios from 'axios';

export default class BaserowApi {

    constructor() {
      }
  
      async getLineConfig(token) {
        const url ='https://api.baserow.io/api/database/rows/table/224804/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "Active", "type": "equal", "value": "1"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)


        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            },
        });
        return response.data.results;
    }


    async getLineAccountByLineID(token,lineId,channelId) {
        
      let url ='https://api.baserow.io/api/database/rows/table/204440/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "LineId", "type": "equal", "value": "#lineId#"}, {"field": "ChannelId", "type": "equal", "value": "#channelId#"}]}'
      let header_info= 'Token #token#'
      header_info = header_info.replace("#token#", token)
      url= url.replace("#lineId#", lineId).replace("#channelId#", channelId)
      console.log('getLineAccountByLineID!!!!! , ',url);

      const response = await axios({
          method: "get",
          url: url,
          headers: {
              Authorization: header_info,
          },
      });
      return response.data.results;
    }

    async getLineAccountPayment(token,lineId,channelId) {
        
        let url ='https://api.baserow.io/api/database/rows/table/228313/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "LineId", "type": "equal", "value": "#lineId#"} , {"field": "ChannelId", "type": "equal", "value": "#channelId#"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#lineId#", lineId).replace("#channelId#", channelId)
        console.log('getLineAccountPayment!!!!! , ',url);
  
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            },
        });
        return response.data.results;
      }

      async getPaymentCode(token,paymentCode,channelId) {
        
        let url ='https://api.baserow.io/api/database/rows/table/228313/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "Code", "type": "equal", "value": "#paymentCode#"} , {"field": "ChannelId", "type": "equal", "value": "#channelId#"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#paymentCode#", paymentCode).replace("#channelId#", channelId)
        console.log('getPaymentCode!!!!! , ',url);
  
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            },
        });
        return response.data.results;
      }

      async paymentCodeBinding(token, rowId , data) {
        
        let url ='https://api.baserow.io/api/database/rows/table/228313/#rowId#/?user_field_names=true'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#rowId#", rowId)
        console.log('paymentCodeBinding!!!!! , ',url);
  
        const response = await axios({
            method: "patch",
            url: url,
            headers: {
                Authorization: header_info,
            },
            data: data
        });
        return response.data;
      }

      async getScriptByChannelIdAndInputKey(token, channelId , inputKey) {
        
        let url ='https://api.baserow.io/api/database/rows/table/241127/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "ChannelId", "type": "equal", "value": "#channelId#"} , {"field": "InputKey", "type": "equal", "value": "#inputKey#"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#channelId#", channelId).replace("#inputKey#", inputKey)

        console.log('getScriptByChannelIdAndInputKey!!!!! , ',url);
  
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            }
        });
        return response.data.results;
      }

      async createAccountGameInfo(token, data) {
        
        let url ='https://api.baserow.io/api/database/rows/table/243641/?user_field_names=true'
        
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        console.log('createAccountGameInfo!!!!! , ',url);
  
        const response = await axios({
            method: "POST",
            url: url,
            headers: {
                Authorization: header_info,
            },
            data: data
        });
        return response.data.results;
      }

      async updateAccountGameInfo(token, rowId , data) {
        
        let url ='https://api.baserow.io/api/database/rows/table/243641/#rowId#/?user_field_names=true'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#rowId#", rowId)
        console.log('updateAccountGameInfo!!!!! , ',url);
  
        const response = await axios({
            method: "patch",
            url: url,
            headers: {
                Authorization: header_info,
            },
            data: data
        });
        return response.data;
      }

      async getAccountGameInfo(token, channelId , lineId) {
        
        let url ='https://api.baserow.io/api/database/rows/table/243641/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "ChannelId", "type": "equal", "value": "#channelId#"} , {"field": "LineId", "type": "equal", "value": "#lineId#"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#channelId#", channelId).replace("#lineId#", lineId)

        console.log('getAccountGameInfo!!!!! , ',url);
  
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            }
        });
        return response.data.results;
      }

      async getGameHistory(token, channelId , lineId , chapter , scenes) {
        
        let url ='https://api.baserow.io/api/database/rows/table/243629/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "ChannelId", "type": "equal", "value": "#channelId#"} , {"field": "LineId", "type": "equal", "value": "#lineId#"}, {"field": "Chapter", "type": "equal", "value": "#chapter#"}]}'
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        url= url.replace("#channelId#", channelId).replace("#lineId#", lineId).replace("#chapter#", chapter)

        console.log('getGameHistory!!!!! , ',url);
  
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization: header_info,
            }
        });
        return response.data.results;
      }

      async createGameHistory(token, data) {

        let url ='https://api.baserow.io/api/database/rows/table/243629/?user_field_names=true'
        
        let header_info= 'Token #token#'
        header_info = header_info.replace("#token#", token)
        console.log('createGameHistory!!!!! , ',url);
  
        const response = await axios({
            method: "POST",
            url: url,
            headers: {
                Authorization: header_info,
            },
            data: data
        });
        return response.data.results;
      }
  }