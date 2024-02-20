import { Composition, staticFile } from 'remotion';
import { AudioGramSchema, AudiogramComposition, fps } from './Composition';
import './style.css';
import { AudioGramSchema2, DevotionalComposition } from './composition/Devotional';
import { JeannetteComposition } from './composition/Jeannette';

export const obtenerFechaActualEnFormato = ()=> {
	const mesesAbreviados = [
	  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
	  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
	];
  
	const fechaActual = new Date();
	const dia = fechaActual.getDate();
	const mesAbreviado = mesesAbreviados[fechaActual.getMonth()];
  
	const fechaFormateada = `${dia} ${mesAbreviado}`;
	return fechaFormateada;
  }

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{
				/*
			<Composition
				id="Audiogram"
				component={AudiogramComposition}
				fps={fps}
				width={1080}
				height={1920}
				schema={AudioGramSchema}
				defaultProps={{"audioOffsetInSeconds":0,"audioFileName":staticFile("audio.mp3"),"coverImgFileName":staticFile("cover.jpg"),"titulo":"","versiculo":"MARCOS 15:1-23","fecha":"20 FEB","titleColor":"rgba(186, 186, 186, 0.93)","subtitlesFileName":staticFile("subtitles.srt"),"onlyDisplayCurrentSentence":true,"subtitlesTextColor":"black","subtitlesLinePerPage":1,"subtitlesZoomMeasurerSize":1,"subtitlesLineHeight":160,"waveColor":"blue","waveFreqRangeStartIndex":1,"waveLinesToDisplay":10,"waveNumberOfSamples":"256" as const,"mirrorWave":true,"durationInSeconds":720}}
				// Determine the length of the video based on the duration of the audio file
				calculateMetadata={({ props }) => {
					return {
						durationInFrames: props.durationInSeconds * fps,
						props,
					};
				}}
			/>
		*/

				<Composition
					id="Audiogram"
					component={DevotionalComposition}
					fps={fps}
					width={1920}
					height={1080}
					schema={AudioGramSchema2}
					defaultProps={{
						// Audio settings
						audioOffsetInSeconds: 0,
						// Title settings
						audioFileName: staticFile('audio.mp3'),
						coverImgFileName: staticFile('cover.jpg'),
						titulo: '',
						versiculo: 'MARCOS 15:1-23',
						fecha: obtenerFechaActualEnFormato(),
						titleColor: 'rgba(186, 186, 186, 0.93)',
						// Subtitles settings
						subtitlesFileName: staticFile('subtitles.srt'),
						onlyDisplayCurrentSentence: true,
						subtitlesTextColor: 'black',
						subtitlesLinePerPage: 1,
						subtitlesZoomMeasurerSize: 1,
						subtitlesLineHeight: 160,
						// Wave settings
						waveColor: 'blue',
						waveFreqRangeStartIndex: 1,
						waveLinesToDisplay: 10,
						waveNumberOfSamples: '256', // This is string for Remotion controls and will be converted to a number
						mirrorWave: true,
						durationInSeconds: 720,
					}}
					// Determine the length of the video based on the duration of the audio file
					calculateMetadata={({ props }) => {
						return {
							durationInFrames: props.durationInSeconds * fps,
							props,
						};
					}}
				/>
			}
		</>
	);
};
