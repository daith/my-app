let linebot = require('linebot')

export default class MyLineBot{

    constructor(config){
      console.log("config {}" , config);
      this.bot = linebot(config);
    }

}