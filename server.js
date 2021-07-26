const WebSocket = require('ws');
let users = [];
let bloks = {};
//wsServer.on('connection', onConnect);
let Connection = class {
  constructor() {
      this.wsServer = new WebSocket.Server({
        port: 9000
      });
    }
    onConnect(wsClient) {
      console.log('Новый пользователь');
      users.push(wsClient)
      console.log(this.users)
      // отправка приветственного сообщения клиенту
      wsClient.send('Привет');
      wsClient.on('message', function(message) {
        console.log(message);
        try {
          // сообщение пришло текстом, нужно конвертировать в JSON-формат
          const jsonMessage = JSON.parse(message);
          console.log(jsonMessage.action);
          switch (jsonMessage.action) {
            case 'ECHO':
            console.log(bloks[jsonMessage.data])
              users.forEach((item, i) => {
                item.send(jsonMessage.data);
              });
              break;
            case 'build':
                  if(bloks[jsonMessage.data] == undefined){
                    bloks[jsonMessage.data] = true;
                      users.forEach((item, i) => {
                        item.send(jsonMessage.data);
                      })
                  }
              break;
            default:
              console.log('Неизвестная команда');
              break;
          }
        } catch (error) {
          console.log('Ошибка', error);
        }
      })
      wsClient.on('close', function() {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
      })
    }
}
exports.WS = new Connection();
