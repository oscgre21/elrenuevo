import { exec } from 'child_process';
import * as fs from 'fs'; 
const TelegramBot = require('node-telegram-bot-api');

//NOTE TEST
async function bootstrap() {
	const token = '7142614402:AAFWs6rh0iYue90vupiVc5UeibY51Dur2_Y';
	const bot = new TelegramBot(token, { polling: true });
	//const chatID = 1527994445;
	bot.onText(/\/echo (.+)/, (msg, match) => {
		const chatId = msg.chat.id;
		const resp = match[1];
		//console.log(resp.text)
		bot.sendMessage(chatId, resp);
	});

	bot.on('message', async (msg) => {
		const chatId = msg.chat.id; 
		console.log('mensajeNota ->', msg);
		const downloadFolder = './public/'; 
		if (!msg.audio) {
			return;
		}
		bot.downloadFile(msg.audio.file_id, downloadFolder)
			.then(function (filePath) {
				console.log(filePath);
				exec(
					'ffmpeg  -y -i ./' +
						filePath +
						' -codec:a libmp3lame -qscale:a 2 ./public/audio.mp3',
					(error, stdout, stderr) => {
						exec(
							"ffmpeg -i ./public/audio.mp3 2>&1 | grep Duration | awk '{print $2}' | sed 's/,//'",
							(error, stdout, stderr) => {
								let timeInSecond = tiempoEnSegundos(stdout);
								const caption = JSON.parse(msg.caption);
								console.log('ffmpeg', caption, msg.audio);
								const data = {
									audioOffsetInSeconds: 0,
									audioFileName: 'remotion-file:audio.mp3',
									coverImgFileName: 'remotion-file:cover.jpg',
									titulo: caption.titulo,
									versiculo: caption.versiculo,
									fecha: '20 FEB',
									titleColor: 'rgba(186, 186, 186, 0.93)',
									subtitlesFileName: 'remotion-file:subtitles.srt',
									onlyDisplayCurrentSentence: true,
									subtitlesTextColor: 'black',
									subtitlesLinePerPage: 1,
									subtitlesZoomMeasurerSize: 1,
									subtitlesLineHeight: 160,
									waveColor: 'blue',
									waveFreqRangeStartIndex: 1,
									waveLinesToDisplay: 10,
									waveNumberOfSamples: '256',
									mirrorWave: true,
									durationInSeconds: timeInSecond,
								};
								console.log('TIEMPO::', timeInSecond);
								writeFile('./public/info.json', JSON.stringify(data));
								console.log('Realizando el build')
								exec("npm run build",	(error, stdout, stderr) => {
									if (error) {
										console.error(`Error: ${error.message}`);
										return;
									  }
									  if (stderr) {
										console.error(`stderr: ${stderr}`);
										return;
									  }
									console.log('Terminando el build')
									bot.sendMessage(
										chatId,
										'Archivo cargado correctamente, proceder a generar el Render:: https://elrenuevo.oscgre.com/Audiogram '
									);
								});

							}
						);
					}
				);
			});
	});

	function tiempoEnSegundos(tiempo: string): number {
		const partes = tiempo.split(':').map(parseFloat);
		const horas = partes[0] || 0;
		const minutos = partes[1] || 0;
		const segundos = partes[2] || 0;
		const roundedNum: number = Math.round(horas * 3600 + minutos * 60 + segundos);
		return roundedNum;
	}
	function writeFile(filePath: string, content: string): Promise<any> {
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, 'utf8', (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
	/*
	async function enviarArchivoGrande(chatId,filePath) {
		const stats = fs.statSync(filePath);
		const fileSizeInBytes = stats.size;
		const chunkSize = 1024 * 1024; // Tamaño del fragmento en bytes (1 MB en este caso)
		const totalChunks = Math.ceil(fileSizeInBytes / chunkSize);
	
		console.log('fileSizeInBytes::',fileSizeInBytes)
		// Enviar el archivo como documento
		const documentOpts = {
			chat_id: chatId,
			document: fs.createReadStream(filePath),
			caption: '¡Aquí está tu archivo grande!'
		};
	
		console.log(documentOpts);
		try{
			const documentMessage = await bot.sendDocument(documentOpts);
			console.log(documentMessage, totalChunks);
	
			// Obtener el ID del mensaje del documento enviado
			const documentMessageId = documentMessage.message_id;
		
			// Enviar cada fragmento del archivo
			for (let currentChunk = 1; currentChunk <= totalChunks; currentChunk++) {
				const start = (currentChunk - 1) * chunkSize;
				const end = currentChunk * chunkSize;
		
				const fileStream = fs.createReadStream(filePath, { start, end });
		
				// Enviar cada fragmento como un mensaje
				const opts = {
					chat_id: chatId,
					document: fileStream,
					reply_to_message_id: documentMessageId
				};
		
				await bot.sendDocument(opts);
			}
		}catch(e){
			console.log(e)
		}
	}*/
}
bootstrap();
