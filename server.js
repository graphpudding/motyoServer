const WebSocket = require('ws');
let users = [];
let bloks = {};
let colors = ["red","blue","green","white","yellow","black","purple","orange"]
//wsServer.on('connection', onConnect);
let Connection = class {
  constructor() {
      this.wsServer = new WebSocket.Server({
        port: 9000
      });
    }
    onConnect(wsClient) {
      console.log('Новый пользователь');
      users.push(wsClient);
      console.log(this.users);
      // отправка приветственного сообщения клиенту
      wsClient.send(JSON.stringify({type:"message",ms:'Привет'}));
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
            case 'newUser':
              let ms = {type:"initUser",name:"user",color: colors[0],obj: bloks};
              colors.splice(0,1);
              wsClient.send(JSON.stringify(ms));
            break;
            case 'build':
                  if(bloks[jsonMessage.name] == undefined){
                    bloks[jsonMessage.name] = {user:jsonMessage.user,color: jsonMessage.color};
                      users.forEach((item, i) => {
                        item.send(JSON.stringify({type:"build",id: jsonMessage.name,color: jsonMessage.color}));
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
