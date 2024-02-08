const Service = require('node-windows').Service

const svc = new Service({
        name : "mqtt-lalan-alarm-publisher",
        description:"This is the mqtt alarm publisher service",
        script : "./dist/app.js"

})

// svc.on('install', function(){
//     svc.start()
// })

// svc.install()


switch (process.argv[2]) {
    case 'install':
        svc.install();
      break;
    case 'uninstall':
        svc.uninstall();
      break;
    case 'start':
        svc.start();
      break;
    case 'stop':
        svc.stop();
      break;
  }
  
      