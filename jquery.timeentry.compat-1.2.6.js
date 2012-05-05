/* http://keith-wood.name/timeEntry.html
   Time entry for jQuery compatibility from v1.2.6 to v1.4.0.
   Written by Keith Wood (kbwood@virginbroadband.com.au) June 2007.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

$.extend($.timeEntry, {

	/* Reconfigure the settings for a time entry input field.
	   @param  input     element - input field to update settings for or
						 jQuery - jQuery collection containing input field or
						 string - jQuery selector for the input field
	   @param  settings  object - the new settings */
	reconfigureFor: function(input, settings) {
		input = (input.jquery ? input[0] : (typeof input == 'string' ? $(input)[0] : input));
		$.timeEntry._changeTimeEntry(input, settings);
	},

	/* Enable a time entry input and any associated spinner.
	   @param  inputs  string - selector for input field(s) or
					   element - single input field or
					   object - jQuery collection of input fields
	   @return void */
	enableFor: function(inputs) {
		inputs = (inputs.jquery ? inputs : $(inputs));
		inputs.each(function() {
			$.timeEntry._enableTimeEntry(this);
		});
	},

	/* Disable a time entry input and any associated spinner.
	   @param  inputs  string - selector for input field(s) or
					   element - single input field or
					   object - jQuery collection of input fields
	   @return void */
	disableFor: function(inputs) {
		inputs = (inputs.jquery ? inputs : $(inputs));
		inputs.each(function() {
			$.timeEntry._disableTimeEntry(this);
		});
	},

	/* Check whether an input field has been disabled.
	   @param  input  element - input field to check or
					  jQuery - jQuery collection containing input field or
					  string - jQuery selector for the input field
	   @return true if this field has been disabled, false if it is enabled */
	isDisabled: function(input) {
		input = (input.jquery ? input[0] : (typeof input == 'string' ? $(input)[0] : input));
		return $.timeEntry._isDisabledTimeEntry(input);
	},

	/* Initialise the current time for a time entry input field.
	   @param  input  element - input field to update or
					  jQuery - jQuery collection containing input field or
					  string - jQuery selector for the input field
	   @param  time   Date - the new time (year/month/day ignored) or null for now */
	setTimeFor: function(input, time) {
		input = (input.jquery ? input[0] : (typeof input == 'string' ? $(input)[0] : input));
		$.timeEntry._setTimeTimeEntry(input, time);
	},

	/* Retrieve the current time for a time entry input field.
	   @param  input  element - input field to update or
					  jQuery - jQuery collection containing input field or
					  string - jQuery selector for the input field
	   @return Date with the set time (year/month/day zero) or null if none */
	getTimeFor: function(input) {
		input = (input.jquery ? input[0] : (typeof input == 'string' ? $(input)[0] : input));
		return $.timeEntry._getTimeTimeEntry(input);
	}
});

})(jQuery);
