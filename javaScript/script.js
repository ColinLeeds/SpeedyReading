// JavaScript Document
var testText = "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.";

var textArr;
var groupSize = 3;
var firstWord = 0;

var defaultTextSize = 18;
var defaultGroupSize = 3;
var defaultHighlightTime = 2000;

var textSize = defaultTextSize;
var groupSize = defaultGroupSize;
var highlightTime = defaultHighlightTime;

var highlightIntervalId = 0;
var endReached = false;

var defaultNormalBackgroundColor = '#FFFFCC';
var defaultNormalTextColor = '#000000';
var defaultHighlightBackgroundColor = '#000000';
var defaultHighlightTextColor = '#FFFFFF';

var normalBackgroundColor = defaultNormalBackgroundColor;
var normalTextColor = defaultNormalTextColor;
var highlightBackgroundColor = defaultHighlightBackgroundColor;
var highlightTextColor = defaultHighlightTextColor;

var currentText = testText;

var textGathered = false;

$(document).ready
(
	function()
	{
		getReadingText();	
		
		setupTextSizeControl();
		setupGroupSizeControl();
		setupHighlightTimeControl();
		setupColorControls();
		setupGoButton();
		setupStopButton();
		setupCookieConsentButton();
		setupChangeTextButton();
		setupContactFormValidation();
		
		var cookieConsent = $.cookie('consent');
		if(cookieConsent != undefined)
		{
			$('.cookieMessage').css('display', 'none');
		}
	}
)

function highlightWordGroup()
{
	if(!highlightText())
	{
		firstWord += groupSize;
	}
	else
	{
		clearInterval(highlightIntervalId);
		endReached = false;
		//Highlight the last words for the required interval, then move the highlight back to the start
		var highlightTime = $('#wordGroupHighlightSlider').val();
		setTimeout(resetToStart, highlightTime);
	}
}

function resetToStart()
{
	$('#stop').attr('disabled', true);
	$('#go').attr('disabled', false);
	setControlsDisabled(false);
	
	firstWord = 0;
	highlightText()
}

function highlightText()
{	
	//clear out the existing text
	$('#textToRead').html('');
	
	textArr = currentText.split(' ');
	
	for(var i=0; i<textArr.length; i++)
	{
		if(i ==  firstWord)
		{
			$('#textToRead').append('<span class="highlight">' + getWordsInGroup(i, groupSize, textArr) + '</span> ');
			$('.highlight').css('background-color', $('#highlightBackground').val());
			$('.highlight').css('color', $('#highlightText').val());
			i += groupSize;
		};
		
		i = ensureInt(i);
		
		if(!endReached)
		{
			$('#textToRead').append(textArr[i]+' ');
		}
	}
	
	if(endReached)
	{
		return true;
	}
	
	return false;
}

function getWordsInGroup(start, groupSize, textArr)
{
	var wordsInGroup = "";
	var arrayLength = textArr.length;
	
	if((start+groupSize) >= arrayLength)
	{
		for(var i=start; i<arrayLength; i++)
		{
			wordsInGroup += textArr[i] + ' ';
		}
		endReached = true;
	}
	else
	{
		for(var i=start; i<(start+groupSize); i++)
		{
			wordsInGroup += textArr[i] + ' ';
		}
	}
	
	return wordsInGroup.substring(0, wordsInGroup.length - 1);
}

function ensureInt(i)
{
	if(typeof i != 'number')  //i can be changed to a string by the i+=groupSize
	{
		i = parseInt(i);
	}
	
	return i;
}

/*Set up the font size control*/
function setupTextSizeControl()
{
	textSize = ensureInt($.cookie('fontSize'));
	if(textSize == undefined)
	{
		textSize = defaultTextSize;
	}

	$('#fontSizeSlider').val(textSize);
	$('#fontSizeDisplay').html(textSize);
	$('#textToRead').css('font-size', textSize+'px');
	$('#fontSizeSlider').bind
	(
		'change',
		function(event, value)
		{
			var fSize = event.target.value;
			$('#fontSizeDisplay').html(fSize);
			$('#textToRead').css('font-size', fSize+'px');
			$.cookie('fontSize', fSize, {expires:9999});
			cookieConsent();
		}
	);
}

/*Set up the word group control*/
function setupGroupSizeControl()
{
	groupSize = ensureInt($.cookie('groupSize'));
	if(groupSize == undefined)
	{
		groupSize = defaultGroupSize;
	}
	
	$('#wordGroupSlider').val(groupSize);
	$('#wordGroupDisplay').html(groupSize);
	$('#wordGroupControl').bind
	(
		'change',
		function(event, value)
		{
			groupSize = event.target.value;
			groupSize = ensureInt(groupSize);
			$('#wordGroupDisplay').html(groupSize);
			highlightText();
			$.cookie('groupSize', groupSize, {expires:9999});
			cookieConsent()
		}
	);
}

/*Set up the highlight control*/
function setupHighlightTimeControl()
{
	highlightTime = ensureInt($.cookie('highlightTime'));
	if(highlightTime == undefined)
	{
		highlightTime = defaultHighlightTime;
	}
	
	$('#wordGroupHighlightSlider').val(highlightTime);
	$('#wordGroupHighlightDisplay').html(highlightTime);
	$('#wordGroupHighlightSlider').bind
	(
		'change',
		function(event, value)
		{
			var wordGroupHighlight = event.target.value;
			$('#wordGroupHighlightDisplay').html(wordGroupHighlight);
			$.cookie('highlightTime', wordGroupHighlight, {expires:9999});
			cookieConsent();
		}
	);
}

function setupColorControls()
{
	normalBackgroundColor = $.cookie('normalBackground');
	if(normalBackgroundColor == undefined)
	{
		normalBackgroundColor = defaultNormalBackgroundColor;
	}
	
	$('#normalBackground').val(normalBackgroundColor);
	$('#textToRead').css('background-color', normalBackgroundColor);
	$('#normalBackground').bind
	(
		'change',
		function(event, value)
		{
			var normalBackgroundColor = event.target.value;
			$('#textToRead').css('background-color', normalBackgroundColor);
			$.cookie('normalBackground', normalBackgroundColor, {expires:9999});
			cookieConsent();
		}
	);
	
	normalTextColor = $.cookie('normalText');
	if(normalTextColor == undefined)
	{
		normalTextColor = defaultNormalTextColor;
	}
	
	$('#normalText').val(normalTextColor);
	$('#textToRead').css('color', normalTextColor);
	$('#normalText').bind
	(
		'change',
		function(event, value)
		{
			var normalTextColor = event.target.value;
			$('#textToRead').css('color', normalTextColor);
			$.cookie('normalText', normalTextColor, {expires:9999});
			cookieConsent();
		}
	);
	
	highlightBackgroundColor = $.cookie('highlightBackground');
	if(highlightBackgroundColor == undefined)
	{
		highlightBackgroundColor = defaultHighlightBackgroundColor;
	}
	
	$('#highlightBackground').val(highlightBackgroundColor);
	$('.highlight').css('background-color', highlightBackgroundColor);
	$('#highlightBackground').bind
	(
		'change',
		function(event, value)
		{
			var highlightBackgroundColor = event.target.value;
			$('.highlight').css('background-color', highlightBackgroundColor);
			$.cookie('highlightBackground', highlightBackgroundColor, {expires:9999});
			cookieConsent();
		}
	);
	
	highlightTextColor = $.cookie('highlightText');
	if(highlightTextColor == undefined)
	{
		highlightTextColor = defaultHighlightTextColor;
	}
	
	$('#highlightText').val(highlightTextColor);
	$('.highlight').css('color', highlightTextColor);
	$('#highlightText').bind
	(
		'change',
		function(event, value)
		{
			var highlightTextColor = event.target.value;
			$('.highlight').css('color', highlightTextColor);
			$.cookie('highlightText', highlightTextColor, {expires:9999});
			cookieConsent();
		}
	);
	
	
}

/*Set up the go button*/
function setupGoButton()
{
	$('#go').bind
	(
		'click',
		function()
		{
			if(highlightIntervalId != 0)
			{
				clearInterval(highlightIntervalId);
			}
			
			endReached = false;
			firstWord = ensureInt($('#wordGroupSlider').val());
			var highlightTime = $('#wordGroupHighlightSlider').val();
			
			highlightIntervalId = setInterval(highlightWordGroup, highlightTime);
			
			setControlsDisabled(true);
			
			$('#go').attr('disabled', true);
			$('#stop').attr('disabled', false);
			$('#change').attr('disabled', true);
		}
	);
}

/*Set up the stop button*/
function setupStopButton()
{
	$('#stop').bind
	(
		'click',
		function()
		{
			clearInterval(highlightIntervalId);
			
			setControlsDisabled(false);
			
			$('#go').attr('disabled', false);
			$('#stop').attr('disabled', true);
			$('#change').attr('disabled', false);
			
			firstWord = 0;
			
			highlightText();
		}
	);
}

function setupChangeTextButton()
{
	$('#change').bind
	(
		'click',
		function()
		{
			getReadingText();
		}
	);
}


function setupContactFormValidation()
{
	jQuery.validator.addMethod
	(
		'answercheck', 
		function (value, element) 
		{
        	return this.optional(element) || /^\bcat\b$/.test(value);
    	}, 
		"type the correct answer -_-"
	);

	$('#contact').validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: true,
				minlength: 10
            },
            answer: {
                required: true,
                answercheck: true
            }
        },
        messages: {
            name: {
                required: "come on, you have a name don't you?",
                minlength: "your name must consist of at least 2 characters"
            },
            email: {
                required: "no email, no message"
            },
            message: {
                required: "um...yea, you have to write something to send this form.",
                minlength: "thats all? really?"
            },
            answer: {
                required: "sorry, wrong answer!"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"process.php",
                success: function() {
                    $('#contact :input').attr('disabled', 'disabled');
                    $('#contact').fadeTo( "slow", 0.15, function() {
                        $(this).find(':input').attr('disabled', 'disabled');
                        $(this).find('label').css('cursor','default');
                        $('#success').fadeIn();
                    });
                },
                error: function() {
                    $('#contact').fadeTo( "slow", 0.15, function() {
                        $('#error').fadeIn();
                    });
                }
            });
        }
    });
}

function setupCookieConsentButton()
{
	$('#cookieOK').bind
	(
		'click',
		function()
		{
			cookieConsent();
		}
	);
}

function showHideControls()
{
	if($('#showHideControls').html() == 'Show controls')
	{
		$('#showHideControls').html('Hide controls');
		$('#speedyTextControls').slideDown('slow');
	}
	else
	{
		$('#showHideControls').html('Show controls');
		$('#speedyTextControls').slideUp('slow');
	}
}

function setControlsDisabled(attrValue)
{
	$('#fontSizeSlider').attr('disabled', attrValue);
	$('#wordGroupSlider').attr('disabled', attrValue);
	$('#wordGroupHighlightSlider').attr('disabled', attrValue);
	$('#normalBackground').attr('disabled', attrValue);
	$('#normalText').attr('disabled', attrValue);
	$('#highlightBackground').attr('disabled', attrValue);
	$('#highlightText').attr('disabled', attrValue);
}

function cookieConsent()
{
	$('#cookieDivision').slideUp('slow');
	setTimeout
	(
		function()
		{
			$('#cookieDivision').css('display', 'none');
		},
		5000
	);
	$.cookie('consent', true, {expires:9999, path: '/'});
}

function getReadingText()
{
	/*make an ajax call to getText.php*/
	var query = "getText.php";
	
	$.ajax
	(
		{
			type:'GET',
			dataType: 'html',
			url:query,
			success:processData
		}
	);
}

function processData(data)
{
	currentText = data;
	$('#textToRead').html('');
	$('#textToRead').append(currentText);
	highlightText();
}