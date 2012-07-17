/* http://keith-wood.name/timeEntry.html
   Simplified Chinese initialisation for the jQuery time entry extension.
   By taiansu(taiansu@gmail.com) */
(function($) {
	$.timeEntry.regional['zh-TW'] = {show24Hours: false, separator: ':',
		ampmPrefix: '', ampmNames: ['AM', 'PM'],
		spinnerTexts: ['現在時刻', '上一個欄位', '下一個欄位', '增加', '减少']};
	$.timeEntry.setDefaults($.timeEntry.regional['zh-CN']);
})(jQuery);
