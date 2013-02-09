var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs')
	, url = require("url")
	, config = require('./config.js');

function handler (req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log('requesting file: '+pathname);
	fileServer(res, pathname);
}

io.sockets.on('connection', function (socket) {
	//socket.emit('element', { html: 'Node.js jQuery jQuery-ui jQuery-mobile', elem: 'title' });
	//socket.emit('element', { html: getFileSync('/body.html'), elem: 'body' });
	//socket.emit('element', { html: getFileSync('/about.html'), elem: 'div#tabs-1' });
	//socket.emit('element', { html: getFileSync('/shares.html'), elem: 'div#tabs-2' });
	//socket.emit('element', { html: getFileSync('/news.html'), elem: 'div#tabs-3' });
});

app.listen(config['host']['port'], config['host']['ip']);

function fileServer (res, pathname) {
	switch (pathname) {
		case '/custom-css':
			serveFile(res, '/css/custom.css');
			break;
		case '/LetterSetA':
			serveFile(res, '/css/fonts/LetterSetA.ttf');
			break;
		case '/logo.png':
			serveFile(res, '/css/images/logo.png');
			break;
		case '/jquery-mobile-listview':
			serveFile(res, '/js/jquery.mobile.custom.js');
			break;
		case '/jquery-mobile-listview-css':
			serveFile(res, '/css/jquery.mobile.custom.structure.css');
			break;
		case '/mobile-touch':
			serveFile(res, '/css/jquery.mobile.custom.js');
			break;
		case '/js':
			serveFile(res, '/js/main.js', templateCheck);
			break;
		default:
			serveFile(res, '/index.html', templateCheck);
			break;
	}
}

function getFileSync (filename) {return fs.readFileSync(__dirname + filename)}

function templateCheck (data) {
	var string = data.toString()
		.replace('(((hostmask)))',config['host']['mask'])
		.replace('(((description)))', config['host']['description'])
		.replace('(((keywords)))', config['host']['keywords'])
		.replace('(((author)))', config['host']['author'])
		.replace('(((body)))', getFileSync('/body.html'))
		.replace('(((about)))', getFileSync('/about.html'))
		.replace('(((shares)))', getFileSync('/shares.html'))
		.replace('(((news)))', getFileSync('/news.html'))
		.replace('(((touchpunch)))', getFileSync('/js/touchpunch.js'))
		
	var buf = new Buffer(string);
	return buf;
}

function serveFile (res, file, filterfunc) {
	filterfunc = typeof filterfunc !== 'undefined' ? filterfunc : function (data) {return data};
	fs.readFile(__dirname + file,
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + file);
			}
			res.writeHead(200);
			res.end(filterfunc(data));
			return 0;
		}
	);
}