/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Simplified Chinese initialisation for the jQuery time entry extension. */
$(document).ready(function(){
	timeEntry.regional['zh-cn'] = {show24Hours: false, separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['µ±Ç°', '×óÒÆ', 'ÓÒÒÆ', '¼ÓÒ»', '¼õÒ»']};
	timeEntry.setDefaults(timeEntry.regional['zh-cn']);
});