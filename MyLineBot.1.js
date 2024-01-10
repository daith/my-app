let linebot = require('linebot');

class MyLineBot {



    constructor(config) {
        console.log("config {}", config);
        this.bot = linebot(config);

        this.bot.on('message', function (event) {
            // 把收到訊息的 event 印出來
            console.log(event);
        });
    }

    linebotParser(req, res) {
        this.bot.parser(req, res);

    }

}
