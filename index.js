const { Worker, workerData } = require('worker_threads');
const request = require('request');

function startWorker(path, cb) {
	const worker = new Worker(path, { workerData: null });
	worker.on('message', (msg) => {
		cb(null, msg);
	});
	worker.on('error', cb);
	worker.on('exit', (code) => {
		if(code != 0)
	    console.error(new Error(`Worker completed com exit code = ${code}`));
   });
	return worker;
}

// start worker in another thread
startWorker(__dirname + '/worker-code.js', (err, result) => {
	if(err) return console.error(err);
  console.log('** heavy computation completed **');
	console.log(`duration = ${(result.end - result.start) / 1000} seconds`);
});

request.get('http://www.google.com', (err, resp) => {
	if(err) return console.error(err);
	console.log(`total bytes received = ${resp.body.length}`);
});