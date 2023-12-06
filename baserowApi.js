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


    async getLineAccountByLineID(token,lineId) {
        
      let url ='https://api.baserow.io/api/database/rows/table/204440/?user_field_names=true&filters={"filter_type": "AND", "filters": [{"field": "LineId", "type": "equal", "value": "#lineId#"}]}'
      let header_info= 'Token #token#'
      header_info = header_info.replace("#token#", token)
      url= url.replace("#lineId#", lineId)
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
  }