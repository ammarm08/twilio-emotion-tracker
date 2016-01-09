var cluster = require('cluster')
var count = require('os').cpus().length

function createWorker() {
  if (cluster.isMaster) {
    var child = cluster.fork();

    // Respawn the child process after an exit
    child.on('exit', function(code, sig) {
      createWorker();
    });
  } else {
    require('./server-config.js');
  }
}

function createWorkers(n) {
  while (n-- > 0) {
    createWorker();
  }
}

function killAllWorkers(signal) {
  var uniqueID;
  var worker;

  for (uniqueID in cluster.workers) {
    if (cluster.workers.hasOwnProperty(uniqueID)) {
      worker = cluster.workers[uniqueID];
      worker.removeAllListeners();
      worker.process.kill(signal);
    }
  }
}

process.on('SIGHUP', function () {
  killAllWorkers('SIGTERM');
});

process.on('SIGTERM', function () {
  killAllWorkers('SIGTERM');
});

createWorkers(count);