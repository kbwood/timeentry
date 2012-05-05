/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Romanian initialisation for the jQuery time entry extension
   Written by Edmond L. (ll_edmond@walla.com)  */
$(document).ready(function(){
	timeEntry.regional['ro'] = {show24Hours: true,  separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['Acum', 'Campul Anterior', 'Campul Urmator', 'Mareste', 'Micsoreaza']};
	timeEntry.setDefaults(timeEntry.regional['ro']);
});