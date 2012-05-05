/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Italian initialisation for the jQuery time entry extension
   Written by Apaella (apaella@gmail.com) June 2007.
   Under the Creative Commons Licence http://creativecommons.org/licenses/by/3.0/
   Share or Remix it but please Attribute the author. */
$(document).ready(function(){
	timeEntry.regional['it'] = {show24Hours: true, separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['Adesso', 'Precedente', 'Successivo', 'Aumenta', 'Diminuisci']};
	timeEntry.setDefaults(timeEntry.regional['it']);
});