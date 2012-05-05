/* http://keith-wood.name/timeEntry.html
   Swedish initialisation for the jQuery time entry extension.
   Written by Anders Ekdahl ( anders@nomadiz.se). */
$(document).ready(function() {
	$.timeEntry.regional['sv'] = {show24Hours: true, separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['Nu', 'Förra fältet', 'Nästa fält', 'öka', 'minska']};
    $.timeEntry.setDefaults($.timeEntry.regional['sv']); 
});
