const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

var Client = require('node-rest-client').Client;
var client = new Client();

var rp = require('request-promise');
var axios = require('axios');

var app = express();

app
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/', (req, res) => res.render('pages/index'))
	.post('/', (req, res) => {
		res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ message: 'Heroku API is working' }, null, 2));
		res.end();
	})
	.post('/first', (req, res) => {
		console.log('Call post....');
		let args = {
			headers: { 'Content-Type': 'application/json' },
			data: {
				schema: 'greenban',
				action: 'select',
				collection: 'CalendarEmployee',
				fields: '*',
				find: `EmployeeId = 'f0cd394a-5cf1-419f-a1b7-283ecbd5d4d2'`
			},
			mimetypes: {
				json: [ 'application/json', 'application/json;charset=utf-8' ]
			}
		};
		let syncRequest = client.post('http://55.206.64.112:8000/executeSQL', args, (data, response) => {
			console.log('1 ' + typeof response);
			for (var i in data) {
				console.log(`${i} : ${data[i]}`);
			}
			console.log('2 ' + typeof data);
			if (data.Status === true) {
				console.log(' ## ' + response);
				res.send(data);
			} else {
				res.send('#1 Call error');
				console.log('#1 Call to Sync API error');
			}
			res.end();
		});
		syncRequest.on('error', (err) => {
			console.log('#2 Call to Sync API error');
			res.send('Call API error');
			res.end();
		});
	})
	.post('/second', (req, res) => {
		let options = {
			method: 'post',
			uri: 'http://54.206.64.112:8000/executeSQL',
			headers: {
				'User-Agent': 'Request-Promise',
				'Content-Type': 'application/json'
			},
			body: {
				schema: 'greenban',
				action: 'select',
				collection: 'CalendarEmployee',
				fields: '*',
				find: `EmployeeId = 'f0cd394a-5cf1-419f-a1b7-283ecbd5d4d2'`
			},
			json: true,
			resolveWithFullResponse: false
		};
		rp(options)
			.then((response) => {
				console.log(response);
				res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(response, null, 2));
				res.end();
				// res.send(response.body);
			})
			.catch(function(err) {
				res.send('Call API error');
				res.end();
			});
	})
	.post('/third', (req, res) => {
		var config = {
			headers: { 'Content-Type': 'application/json' },
			baseURL: 'http://ec2-54-206-64-112.ap-southeast-2.compute.amazonaws.com:8000',
			timeout: 1000
		};
		axios
			.post(
				'/executeSQL',
				{
					schema: 'greenban',
					action: 'select',
					collection: 'CalendarEmployee',
					fields: '*',
					find: `EmployeeId = 'f0cd394a-5cf1-419f-a1b7-283ecbd5d4d2'`
				},
				config
			)
			.then((response, data) => {
				console.log(response);
				console.log('OK');
				res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(response.data, null, 2));
				res.end();
			})
			.catch((error) => {
				console.log(error);
				res.send('Call API error');
				console.log('Not OK');
				res.end();
			});
	})
	.post('/four', (req, res) => {
		console.log('Call post....');
		let args = {
			headers: { 'Content-Type': 'application/json' },
			data: {
				schema: 'greenban',
				action: 'select',
				collection: 'CalendarEmployee',
				fields: '*',
				find: `EmployeeId = 'f0cd394a-5cf1-419f-a1b7-283ecbd5d4d2'`
			}
		};
		let syncRequest = client.get(
			'https://hlcloud-develop-wfmc.bookbookonline.com.au:3001/api-sync-service/',
			args,
			(dataEntity, response) => {
				console.log(dataEntity);
				res.send(dataEntity);
				res.end();
			}
		);
		syncRequest.on('error', (err) => {
			console.log('#2 Call to Sync API error');
			res.send('Call API error');
			res.end();
		});
	})
	.get('/about', (req, res) => {
		var drinks = [
			{ name: 'Bloody Mary', drunkness: 3 },
			{ name: 'Martini', drunkness: 5 },
			{ name: 'Scotch', drunkness: 10 }
		];
		res.render('pages/about', {
			data: drinks
		});
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`)).timeout = 120000;
