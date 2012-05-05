/* http://home.iprimus.com.au/kbwood/jquery/timeEntry.html
   Time entry for jQuery v1.1.
   Written by Keith Wood (kbwood@iprimus.com.au) June 2007.
   Under the Creative Commons Licence http://creativecommons.org/licenses/by/3.0/
   Share or Remix it but please Attribute the author. */
   
/* Turn an input field into an entry point for a time value.
   The time can be entered via directly typing the value, 
   via the arrow keys, or via spinner buttons.
   It is configurable to show 12 or 24-hour time, to show or hide seconds,
   to enforce a minimum and/or maximum time, to change the spinner image,
   and to constrain the time to steps, e.g. only on the quarter hours.
   Attach it with $('input selector').timeEntry(); for default settings,
   or configure it with options like:
   $('input selector').timeEntry(
      {spinnerImage: 'timeEntry2.gif', spinnerSize: [20, 20, 0]}); */
var timeEntry = {
	selectedHour: 0, // The currently selected hour
	selectedMinute: 0, // The currently selected minute
	selectedSecond: 0, // The currently selected second
	appendText: '', // Display text following the input box, e.g. showing the format
	separator: ':', // The separator between time fields
	showSeconds: false, // True to show seconds as well, false for hours/minutes only
	show24Hours: false, // True to use 24 hour time, false for 12 hour (AM/PM)
	ampmNames: ['AM', 'PM'], // Names of morning/evening markers
	timeSteps: [1, 1, 1], // Steps for each of hours/minutes/seconds when incrementing/decrementing
	minTime: null, // The earliest selectable time, or null for no limit
	maxTime: null, // The latest selectable time, or null for no limit
	spinnerImage: 'timeEntry.gif', // The URL of the image to use for the time spinner
	spinnerClickImages: ['timeEntryNow.gif', 'timeEntryPrev.gif', 'timeEntryNext.gif', 
		'timeEntryInc.gif', 'timeEntryDec.gif'], // Array of image URLs for use when "buttons" are clicked, corresponding to texts below
	spinnerSize: [20, 20, 8], // The width and height of the spinner image, and size of centre button for current time
	spinnerTexts: ['Now', 'Previous field', 'Next field', 'Increment', 'Decrement'], // The popup texts for the spinner image areas
	spinnerRepeat: [500, 250], // Initial and subsequent waits in milliseconds for repeats on the spinner buttons
	fieldSettings: null, // Function that takes an input field and returns a set of custom settings for the time entry
	disabledInputs: [], // Internal list of fields that have been disabled

	/* Attach the time entry handler to an input field. */
	connectTimeEntry: function(target) {
		var input = $(target);
		input.wrap('<span class="timeEntry_wrap"></span>').
			after((this.spinnerImage ? '<img class="timeEntry_control" src="' + this.spinnerImage + 
			'" alt="' + this.spinnerText + '" title="' + this.spinnerText + '"/>' : '') + 
			(this.appendText ? '<span class="timeEntry_append">' + this.appendText + '</span>' : ''));
		input.focus(this.doFocus).blur(this.doBlur).keydown(this.doKeyDown).keypress(this.doKeyPress);
		$('../img.timeEntry_control', input).mousedown(this.handleSpinner).
			mouseup(this.endSpinner).mousemove(this.describeSpinner);
	},

	/* Enable a time entry input and any associated spinner. */
	enableFor: function(inputs) {
		inputs = (inputs.jquery ? inputs : $(inputs));
		inputs.each(function() {
			this.disabled = false;
			$('../img.timeEntry_control', this).each(function() { $(this).css('opacity', '1.0'); });
			for (var i = 0; i < timeEntry.disabledInputs.length; i++) {
				if (timeEntry.disabledInputs[i] == this) {
					timeEntry.disabledInputs[i] = null;
					break;
				}
			}
		});
		return false;
	},
	
	/* Disable a time entry input and any associated spinner. */
	disableFor: function(inputs) {
		inputs = (inputs.jquery ? inputs : $(inputs));
		inputs.each(function() {
			this.disabled = true;
			$('../img.timeEntry_control', this).each(function() { $(this).css('opacity', '0.5'); });
			var j = timeEntry.disabledInputs.length;
			for (var i = 0; i < timeEntry.disabledInputs.length; i++) {
				if (timeEntry.disabledInputs[i] == this) {
					j = i;
					break;
				}
				if (!timeEntry.disabledInputs[i] && j == timeEntry.disabledInputs.length) {
					j = i;
				}
			}
			timeEntry.disabledInputs[j] = this;
		});
		return false;
	},
	
	/* Check whether an input field has been disabled. */
	isDisabled: function(inputCheck) {
		for (var i = 0; i < this.disabledInputs.length; i++) {
			if (this.disabledInputs[i] == inputCheck) {
				return true;
			}
		}
		return false;
	},

	/* Initialise time entry. */
	doFocus: function(target) { 
		var newInput = (target.nodeName && target.nodeName.toLowerCase() == 'input' ? target : this);
		if (timeEntry.lastInput == newInput) {
			return;
		}
		if (timeEntry.isDisabled(newInput)) {
			return;
		}
		timeEntry.input = $(newInput);
		timeEntry.lastInput = newInput;
		timeEntry.blurredInput = null;
		timeEntry.lastChr = '';
		timeEntry.field = 0;
		$.extend(timeEntry, (timeEntry.fieldSettings ? timeEntry.fieldSettings(newInput) : {}));
		timeEntry.parseTime();
	},

	/* Note that the field has been exited. */
	doBlur: function(event) {
		timeEntry.blurredInput = timeEntry.lastInput;
		timeEntry.lastInput = null;
	},
	
	/* Handle keystrokes in the field. */
	doKeyDown: function(event) {
		if (event.keyCode >= 48) { // >= '0'
			return true;
		}
		switch (event.keyCode) {
			case 9: return (event.shiftKey ? timeEntry.previousField(true) : // move to previous time field, or out if at the beginning
						timeEntry.nextField(true)); // move to next time field, or out if at the end
			case 35: if (event.ctrlKey) { // clear time on ctrl+end
						timeEntry.input.val('');
					}
					else { // last field on end
						timeEntry.field = Math.max(1, timeEntry.secondField, timeEntry.ampmField);
						timeEntry.adjustField(0);
					}
					break;
			case 36: if (event.ctrlKey) { // current time on ctrl+home
						timeEntry.currentTime();
					}
					else { // first field on home
						timeEntry.field = 0;
						timeEntry.adjustField(0);
					}
					break;
			case 37: timeEntry.previousField(false); break; // previous field on left
			case 38: timeEntry.adjustField(+1); break; // increment time field on up
			case 39: timeEntry.nextField(false); break; // next field on right
			case 40: timeEntry.adjustField(-1); break; // decrement time field on down
			case 46: timeEntry.input.val(''); break; // clear time on delete
		}
		return false;
	},

	/* Disallow unwanted characters. */
	doKeyPress: function(event) {
		var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
		if (chr < ' ') {
			return true;
		}
		if (chr == timeEntry.separator) {
			timeEntry.nextField(false);
		}
		else if (chr >= '0' && chr <= '9') { // allow direct entry of time
			value = (timeEntry.lastChr + chr) * 1;
			hour = (timeEntry.field == 0 && ((timeEntry.show24Hours && value < 24) || (value >= 1 && value <= 12)) ? 
				value : timeEntry.selectedHour);
			minute = (timeEntry.field == 1 && value < 60 ? value : timeEntry.selectedMinute);
			second = (timeEntry.field == timeEntry.secondField && value < 60 ? value : timeEntry.selectedSecond);
			fields = timeEntry.constrainTime([hour, minute, second]);
			timeEntry.setTime(new Date(0, 0, 0, fields[0], fields[1], fields[2]));
			timeEntry.lastChr = chr;
		}
		else if (!timeEntry.show24Hours) { // set am/pm based on first char of names
			if ((chr == timeEntry.ampmNames[0].substring(0, 1).toLowerCase() && timeEntry.selectedHour >= 12) ||
					(chr == timeEntry.ampmNames[1].substring(0, 1).toLowerCase() && timeEntry.selectedHour < 12)) { 
				saveField = timeEntry.field;
				timeEntry.field = timeEntry.ampmField;
				timeEntry.adjustField(+1);
				timeEntry.field = saveField;
				timeEntry.showField();
			}
		}
		return false;
	},
	
	/* Extract the time value from the input field, or default to now. */
	parseTime: function() {
		var currentTime = this.input.val().split(this.separator);
		if (currentTime.length >= 2) {
			this.selectedHour = parseInt(this.trimNumber(currentTime[0]));
			this.selectedHour = (isNaN(this.selectedHour) ? 0 : this.selectedHour);
			this.selectedHour += (this.input.val().indexOf(this.ampmNames[1]) > -1 ? 12 : 0);
			this.selectedMinute = parseInt(this.trimNumber(currentTime[1]));
			this.selectedMinute = (isNaN(this.selectedMinute) ? 0 : this.selectedMinute);
			this.selectedSecond = (currentTime.length >= 3 ? parseInt(this.trimNumber(currentTime[2])) : 0);
			this.selectedSecond = (isNaN(this.selectedSecond) || !this.showSeconds ? 0 : this.selectedSecond);
		} else {
			now = this.constrainTime();
			this.selectedHour = now[0];
			this.selectedMinute = now[1];
			this.selectedSecond = (this.showSeconds ? now[2] : 0);
		}
		this.secondField = (this.showSeconds ? 2 : -1);
		this.ampmField = (this.show24Hours ? -1 : (this.showSeconds ? 3 : 2));
		if (this.input.val() != '') {
			this.showTime();
		}
	},
	
	/* Set the field to the current time. */
	currentTime: function() {
		var now = this.constrainTime();
		this.setTime(new Date(0, 0, 0, now[0], now[1], now[2]));
	},

	/* Constrain the given/current time to the time steps. */
	constrainTime: function(fields) {
		var specified = (fields != null);
		var now = new Date();
		var fields = (specified ? fields : [now.getHours(), now.getMinutes(), now.getSeconds()]);
		var reset = false;
		for (var i = 0; i < this.timeSteps.length; i++) {
			if (reset) {
				fields[i] = 0;
			}
			else if (this.timeSteps[i] > 1) {
				fields[i] = Math.round(fields[i] / this.timeSteps[i]) * this.timeSteps[i];
				reset = !specified;
			}
		}
		return fields;
	},
	
	/* Set the selected time into the input field. */
	showTime: function() {
		var currentTime = (this.formatNumber(this.show24Hours ? this.selectedHour : ((this.selectedHour + 11) % 12) + 1) + 
			this.separator + this.formatNumber(this.selectedMinute) + 
			(this.showSeconds ? this.separator + this.formatNumber(this.selectedSecond) : '') +
			(this.show24Hours ?  '' : (this.selectedHour < 12 ? this.ampmNames[0] : this.ampmNames[1])));
		this.input.val(currentTime);
		this.showField();
	},
	
	/* Highlight the current time field. */
	showField: function() {
		var curInput = this.input[0];
		var start = (this.field == this.ampmField ? 5 + (this.showSeconds ? 3 : 0) : (this.field * 3));
		var end = start + (this.field == this.ampmField ? this.ampmNames[0].length : 2);
		if (curInput.setSelectionRange) { // Mozilla
			curInput.setSelectionRange(start, end);
		}
		else if (curInput.createTextRange) { // IE
			var range = curInput.createTextRange();
			range.moveStart("character", start);
			range.moveEnd("character", end - this.input.val().length);
			range.select();
		}
		curInput.focus();
	},
	
	/* Ensure a number is not treated as octal. */
	trimNumber: function(value) {
		if (value == '')
			return '';
		while (value.charAt(0) == '0') {
			value = value.substring(1);
		}
		return value;
	},
	
	/* Ensure displayed single number has a leading zero. */
	formatNumber: function(value) {
		return (value < 10 ? '0' + value : '' + value);
	},
	
	/* Change the title based on position within the spinner. */
	describeSpinner: function(event) {
		timeEntry.getSpinnerTarget(event).title = 
			timeEntry.spinnerTexts[timeEntry.getSpinnerRegion(event)];
	},
	
	/* Handle a click on the spinner. */
	handleSpinner: function(event) {
		var spinner = timeEntry.getSpinnerTarget(event);
		var curInput = $('../input', spinner)[0];
		if (timeEntry.isDisabled(curInput)) {
			return;
		}
		if (curInput == timeEntry.blurredInput) {
			timeEntry.lastInput = curInput;
			timeEntry.blurredInput = null;
		}
		timeEntry.doFocus(curInput);
		var region = timeEntry.getSpinnerRegion(event);
		if (timeEntry.spinnerClickImages.length > 0) {
			spinner.src = timeEntry.spinnerClickImages[region];
		}
		timeEntry.actionSpinner(region);
		if (region >= 3 && timeEntry.spinnerRepeat[0]) { // repeat increment/decrement
			timeEntry.timer = setTimeout(function() { timeEntry.repeatSpinner(curInput, region); },
				timeEntry.spinnerRepeat[0]);
			$(spinner).one('mouseout', timeEntry.releaseSpinner).
				one('mouseup', timeEntry.releaseSpinner);
		}
	},
	
	/* Action a click on the spinner. */
	actionSpinner: function(region) {
		switch (region) {
			case 0: this.currentTime(); break;
			case 1: this.previousField(false); break;
			case 2: this.nextField(false); break;
			case 3: this.adjustField(+1); break;
			case 4: this.adjustField(-1); break;
		}
	},
	
	/* Repeat a click on the spinner. */
	repeatSpinner: function(curInput, region) {
		timeEntry.lastInput = curInput;
		this.actionSpinner(region);
		this.timer = setTimeout(function() { timeEntry.repeatSpinner(curInput, region); }, 
			this.spinnerRepeat[1]);
	},

	/* Stop a spinner repeat. */
	releaseSpinner: function(event) {
		clearTimeout(timeEntry.timer);
	},

	/* Tidy up after a spinner click. */
	endSpinner: function(event) {
		var spinner = timeEntry.getSpinnerTarget(event);
		spinner.src = timeEntry.spinnerImage;
		timeEntry.lastInput = timeEntry.blurredInput;
		if (timeEntry.lastInput) {
			timeEntry.showField();
		}
	},
	
	/* Retrieve the spinner from the event. */
	getSpinnerTarget: function(event) {
		return (event.target ? event.target : event.srcElement);
	},
	
	/* Determine which "button" within the spinner was clicked. */
	getSpinnerRegion: function(event) {
		var target = this.getSpinnerTarget(event);
		var left = event.clientX - target.offsetLeft;
		var top = event.clientY - target.offsetTop;
		var right = this.spinnerSize[0] - left;
		var bottom = this.spinnerSize[1] - top;
		var min = Math.min(left, top, right, bottom);
		if (Math.abs(left - right) < this.spinnerSize[2] && Math.abs(top - bottom) < this.spinnerSize[2]) {
			return 0; // centre button
		}
		return (min == left ? 1 : (min == right ? 2 : (min == top ? 3 : 4))); // nearest edge
	},

	/* Update the current field in the direction indicated. */
	adjustField: function(offset) {
		if (this.input.val() == '') {
			offset = 0;
		}
		this.setTime(new Date(2001, 1 - 1, 26, 
			this.selectedHour + (this.field == 0 ? offset * this.timeSteps[0] : 0) + 
			(this.field == this.ampmField ? offset * 12 : 0),
			this.selectedMinute + (this.field == 1 ? offset * this.timeSteps[1] : 0),
			this.selectedSecond + (this.field == this.secondField ? offset * this.timeSteps[2] : 0)));
	},

	/* Check against minimum/maximum and display time. */
	setTime: function(time) {
		// normalise to base date
		var time = this.normaliseTime(time);
		this.minTime = this.normaliseTime(this.minTime);
		this.maxTime = this.normaliseTime(this.maxTime);
		// ensure it is within the bounds set
		time = (this.minTime && time < this.minTime ? this.minTime : 
			(this.maxTime && time > this.maxTime ? this.maxTime : time));
		this.selectedHour = time.getHours();
		this.selectedMinute = time.getMinutes();
		this.selectedSecond = time.getSeconds();
		this.showTime();
	},
	
	/* Normalise time object to a common date. */
	normaliseTime: function(time) {
		if (!time) {
			return null;
		}
		time.setFullYear(2001);
		time.setMonth(1 - 1);
		time.setDate(26);
		return time;
	},
	
	/* Move to previous field, or out of field altogether if appropriate (return  true). */
	previousField: function(moveOut) {
		var atFirst = (this.input.val() == '' || this.field == 0);
		if (!atFirst) {
			this.field--;
		}
		this.showField();
		this.lastChr = '';
		return (atFirst && moveOut);
	},
	
	/* Move to next field, or out of field altogether if appropriate (return  true). */
	nextField: function(moveOut) {
		var atLast = (this.input.val() == '' || 
			this.field == (this.showSeconds ? 2 : 1) + (this.show24Hours ? 0 : 1));
		if (!atLast) {
			this.field++;
		}
		this.showField();
		this.lastChr = '';
		return (atLast && moveOut);
	}
};

/* Connect up the time entry functionality. */
$.fn.timeEntry = function(settings) {
	// customise the time entry object
	$.extend(timeEntry, settings || {});
	// attach the time entry functionality to each nominated input element
	return this.each(function() {
		if (this.nodeName.toLowerCase() == 'input') {
			timeEntry.connectTimeEntry(this);
		}
	});
};
