/* Russian (UTF-8) initialisation for the jQuery timeEntry extension. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
$(document).ready(function() {
	timeEntry.regional['ru'] = {
		show24Hours: true,
		spinnerTexts: ['Сейчас', 'Предыдущее поле', 'Следующее поле', 'Больше', 'Меньше']
	};
	timeEntry.setDefaults(timeEntry.regional['ru']);
});
