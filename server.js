const WebSocket = require('ws');
let bloks = {};
let colors = ["red","blue","green","white","yellow","skyBlue","purple","orange","grassGreen","fullOrange","pink"];
let dash = {
red: 0,
blue: 0,
green: 0,
white: 0,
yellow: 0,
skyBlue: 0,
purple: 0,
orange: 0,
grassGreen: 0,
fullOrange: 0,
pink: 0,
}
let vacT = []; //массив вакантных клеток на которых таймер
let Timers = {};
//wsServer.on('connection', onConnect);
let Connection = class {
  constructor() {
      this.wsServer = new WebSocket.Server({
        port: 9000
      });
      this.users=[];
    }
    deleteEl() {
      vacT.forEach((el, i) => {
        if(Timers[el] == undefined){
          vacT.splice(i, 1);
        }
      });
    }
    setVTimeOut(name,time,start){ //через n  времени скидывает запрет на строительство с клетки
      let index = vacT.findIndex(vac => vac == name);
      if(start){
        Timers[name] = setTimeout(()=>{
          this.users.forEach((item, i) => {
            item.send(JSON.stringify({type:"setTimer",id: name,bool: false}));
          })
          delete Timers[name];
          vacT.splice(index, 1);
          this.deleteEl();
          console.log(name,vacT,Timers);
        },time);
      }else if(index > -1){
        this.users.forEach((item, i) => {
          item.send(JSON.stringify({type:"setTimer",id: name,bool: false}));
        })
        //clearTimeout(Timers[name]);
        delete Timers[name];
        vacT.splice(index, 1);
        this.deleteEl();
        console.log(name,vacT,Timers);
      }
    }
    onConnect(wsClient,self) {
      console.log('Новый пользователь');
      self.users.push(wsClient);
    //  console.log(self.users);
      // отправка приветственного сообщения клиенту
      wsClient.send(JSON.stringify({type:"message",ms:'Привет'}));
      wsClient.on('message', function(message) {
        console.log(message,"ms1");
        try {
          // сообщение пришло текстом, нужно конвертировать в JSON-формат
          const jsonMessage = JSON.parse(message);
          console.log(jsonMessage.action);
          switch (jsonMessage.action) {
            case 'ECHO':
            console.log(bloks[jsonMessage.data],"data")
              self.users.forEach((item, i) => {
                item.send(jsonMessage.data);
              });
            break;
            case 'newUser':
              let ms = {type:"initUser",name:"user",color: colors[0],obj: bloks,timers: vacT.toString(),dash: dash};
              wsClient.color = colors[0];
              console.log(vacT.toString(),"vacT");
              colors.splice(0,1);
              wsClient.send(JSON.stringify(ms));
            break;
            case 'build':
                  if(bloks[jsonMessage.name] == undefined){
                    dash[jsonMessage.color]++ ;
                    bloks[jsonMessage.name] = {user:jsonMessage.user,color: jsonMessage.color};
                      self.users.forEach((item, i) => {
                        item.send(JSON.stringify({type:"build",id: jsonMessage.name,color: jsonMessage.color,dash: dash}));
                      })
                      self.setVTimeOut(jsonMessage.name,null,false);
                  }
              break;
            case 'vacant':
                  setTimeout(()=>{
                    console.log({type:"setTimer",id: jsonMessage.name,bool: true,color: jsonMessage.color})
                    self.users.forEach((item, i) => {
                      item.send(JSON.stringify({type:"setTimer",id: jsonMessage.name,bool: true,color: jsonMessage.color}));
                    })
                  },50);
                  vacT.push(jsonMessage.name);
                  self.setVTimeOut(jsonMessage.name,9800,true);
            break;
            case 'delete':
                    bloks[jsonMessage.name] = undefined;
                    dash[jsonMessage.color]--;
                    self.users.forEach((item, i) => {
                      item.send(JSON.stringify({type:"delete",id: jsonMessage.name,bool: true,color: jsonMessage.color,dash: dash}));
                    })
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
        colors.push(wsClient.color);
        console.log('Пользователь отключился');
      })
    }
}
exports.WS = new Connection();
