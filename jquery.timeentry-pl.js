/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Polish initialisation for the jQuery time entry extension. */
/* Polish translation by Jacek Wysocki (jacek.wysocki@gmail.com). */
$(document).ready(function(){
	timeEntry.regional['pl'] = {show24Hours: true, spinnerTexts:
		['Teraz', 'Poprzednie pole', 'Następne pole', 'Zwiększ wartość', 'Zmniejsz wartość']};
	timeEntry.setDefaults(timeEntry.regional['pl']);
});
