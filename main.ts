import { uploadVideo } from "./youtube-upload"; // Assuming module.ts is in the same directory
import { exec } from 'child_process';
import * as fs from 'fs';  

const TelegramBot = require('node-telegram-bot-api');


const description = `
Redes Sociales
📌 Instagram: https://www.instagram.com/RenuevoSD

📌 Facebook: https://www.facebook.com/elrenuevoieer/

📢 WhatsApp: 1-809-568-6039

Para ofrendas
https://elrenuevo.do/donaciones/

#Renuevoencasa #ElRenuevoIEER

página web: https://elrenuevo.do/

Grandes cosas Dios está haciendo con esta familia.`
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
			.then((filePath) => { 
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
								bot.sendMessage(
									chatId,
									'Procesando el video, generando el render'
								);
								exec("npm run build",	(error, stdout, stderr) => {
									if (error) {
										console.error(`Error: ${error.message}`);
										return;
									  }
									  if (stderr) {
										console.error(`stderr: ${stderr}`);
										return;
									  }

									  bot.sendMessage(
											chatId,
											'Cargando video a Youtube!'
										); 
									  exec("ffmpeg -i out/video.mp4 -ss 00:00:05 -vframes 1 -y out/thumbnail.jpg", (error, stdout, stderr) => {
										const fecha_actual = obtenerFechaActual();
										
										uploadVideo(`${caption.titulo} ${caption.versiculo} - Pastor Luis Soto - Días de Renovación - ${fecha_actual} Devocional`,description,caption.titulo);

										console.log('Terminando el build')
										bot.sendMessage(
											chatId,
											'Archivo cargado correctamente a youtube, proceder a generar el Render:: https://elrenuevo.oscgre.com/Audiogram y para descargar video final adjunto URL: https://video-renuevo.oscgre.com/video.mp4'
										);

									  });


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
	function obtenerFechaActual(): string {
		const fecha = new Date();
	
		const dia = fecha.getDate();
		const mes = fecha.getMonth() + 1; // Nota: los meses comienzan desde 0, por eso sumamos 1
		const anio = fecha.getFullYear() % 100; // Obtener solo los últimos dos dígitos del año
	
		// Formatear los componentes de la fecha
		const diaFormateado = dia < 10 ? `0${dia}` : dia;
		const mesFormateado = mes < 10 ? `0${mes}` : mes;
		const anioFormateado = anio < 10 ? `0${anio}` : anio;
	
		// Crear la cadena con el formato deseado
		const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
	
		return fechaFormateada;
	}
	
}
bootstrap();
 

