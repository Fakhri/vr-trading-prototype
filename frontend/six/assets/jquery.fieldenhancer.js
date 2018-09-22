/**
 * FieldEnhancer enhances a standard form field.
 * @author NOSE
 *
 * @requires jquery.js 
 * @example $("#searchTerm").fieldEnhancer("aFormName","#aFormId");
 * @before  
	<form name="aFormName" id="aFormId" action="#">
		<input type="text" name="searchTerm" id="searchTerm" size="8" tabindex="1" />
		<input type="submit" name="sendSearch" id="sendSearch" value="Suchen" class="Submit" tabindex="6" />
	</form>
 *
 * @param formName 		The name of the form.
 * @param formId 		The id of the form.
 * 
 * @option fieldValue 	Default field value.
 * @option classFocus 	State focus class name.
 * @option classBlur 	State blur class name.
 * @version 1.0.0	initial version			
 */
jQuery.fn.fieldEnhancer = function(formName,formId,op) {
	// defaults
	var defaults =  {	
			fieldValue: "...",
			classFocus: "focus",
			classBlur: "blur"
	};
	jQuery.extend(defaults, op);
	
	// init
	var field = jQuery(this);
	var fieldName = field.attr("name");
	stateBlur();
	
	// events
	field.bind("focus", function(){stateFocus()});
	field.bind("blur", function(){stateBlur()});
	jQuery(formId).bind("submit", function() { 
			submitForm();
	});
	
	/*
	* Handles the focus state.
	*/
	function stateFocus() {
		if (document[formName][fieldName].value == defaults.fieldValue) {
			// value										
  			document[formName][fieldName].value = "";
			// class
			field.addClass("focus");
			field.removeClass("blur");
		}
	}
	
	/*
	* Handles the blur state.
	*/
	function stateBlur() {
		var currentValue = document[formName][fieldName].value;
		if (currentValue == "" || currentValue == defaults.fieldValue) {
  			document[formName][fieldName].value = defaults.fieldValue;
			field.addClass("blur");
			field.removeClass("focus");
		}
	}
	/*
	* Submit the form.
	*/
	function submitForm() {
		// reset
		var currentValue = document[formName][fieldName].value;
		if (currentValue == defaults.fieldValue) {
			document[formName][fieldName].value = "";
		}
		return true;
	}
	
 
    // return
    return this;
};
