/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Spanish initialisation for the jQuery time entry extension
   Written by diegok (diego@freekeylabs.com).
   Under the Creative Commons Licence http://creativecommons.org/licenses/by/3.0/
   Share or Remix it but please Attribute the author. */
$(document).ready(function(){
	timeEntry.regional['es'] = {show24Hours: true, separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['Ahora', 'Campo anterior', 'Siguiente campo', 'Aumentar', 'Disminuir']};
	timeEntry.setDefaults(timeEntry.regional['es']);
});
