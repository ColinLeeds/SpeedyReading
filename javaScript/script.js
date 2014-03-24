// JavaScript Document
var testText = "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.";

var textArr;
var groupSize = 3;
var firstWord = 0;

var defaultTextSize = 18;
var defaultGroupSize = 3;
var defaultHighlightTime = 2000;

var highlightIntervalId = 0;
var endReached = false;

var defaultNormalBackgroundColor = '#FFFFCC';
var defaultNormalTextColor = '#000000';
var defaultHighlightBackgroundColor = '#000000';
var defaultHighlightTextColor = '#FFFFFF';

$(document).ready
(
	function()
	{
		setupTextSizeControl();
		setupGroupSizeControl();
		setupHighlightTimeControl();
		setupColorControls();
		setupGoButton();
		setupStopButton();
		setupCookieConsentButton();
		
		/*$('#speedReadingWhat').bind
		(
			'click',
			function()
			{
				$('#speedReadingWhatAnswer').slideToggle('slow');
			}
		);
			
		$('#speedReadingWhatHide').bind
		(
			'click',
			function()
			{
				$('#speedReadingWhatAnswer').slideUp('slow');
			}
		);*/
		
		var cookieConsent = $.cookie('consent');
		if(cookieConsent != undefined)
		{
			$('.cookieMessage').css('display', 'none');
		}
		
		highlightText();
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
	
	textArr = testText.split(' ');
	
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
	var fontSize = $.cookie('fontSize');
	if(fontSize != undefined)
	{
		defaultTextSize = fontSize;
	}
	$('#fontSizeSlider').val(defaultTextSize);
	$('#fontSizeDisplay').html(defaultTextSize);
	$('#textToRead').css('font-size', defaultTextSize+'px');
	$('#fontSizeSlider').bind
	(
		'change',
		function(event, value)
		{
			var fSize = event.target.value;
			$('#fontSizeDisplay').html(fSize);
			$('#textToRead').css('font-size', fSize+'px');
			$.cookie('fontSize', fSize);
			cookieConsent();
		}
	);
}

/*Set up the word group control*/
function setupGroupSizeControl()
{
	var groupSize = $.cookie('groupSize');
	if(groupSize != undefined)
	{
		defaultGroupSize = groupSize;
	}
	$('#wordGroupSlider').val(defaultGroupSize);
	$('#wordGroupDisplay').html(defaultGroupSize);
	$('#wordGroupControl').bind
	(
		'change',
		function(event, value)
		{
			groupSize = event.target.value;
			groupSize = ensureInt(groupSize);
			$('#wordGroupDisplay').html(groupSize);
			highlightText();
			$.cookie('groupSize', groupSize);
			cookieConsent()
		}
	);
}

/*Set up the highlight control*/
function setupHighlightTimeControl()
{
	var highlightTime = $.cookie('highlightTime');
	if(highlightTime != undefined)
	{
		defaultHighlightTime = highlightTime;
	}
	$('#wordGroupHighlightSlider').val(defaultHighlightTime);
	$('#wordGroupHighlightDisplay').html(defaultHighlightTime);
	$('#wordGroupHighlightSlider').bind
	(
		'change',
		function(event, value)
		{
			var wordGroupHighlight = event.target.value;
			$('#wordGroupHighlightDisplay').html(wordGroupHighlight);
			$.cookie('highlightTime', wordGroupHighlight);
			cookieConsent();
		}
	);
}

function setupColorControls()
{
	var normalBackground = $.cookie('normalBackground');
	if(normalBackground != undefined)
	{
		defaultNormalBackgroundColor = normalBackground;
	}
	$('#normalBackground').val(defaultNormalBackgroundColor);
	$('#textToRead').css('background-color', defaultNormalBackgroundColor);
	$('#normalBackground').bind
	(
		'change',
		function(event, value)
		{
			var normalBackgroundColor = event.target.value;
			$('#textToRead').css('background-color', normalBackgroundColor);
			$.cookie('normalBackground', normalBackgroundColor);
			cookieConsent();
		}
	);
	
	var normalText = $.cookie('normalText');
	if(normalText != undefined)
	{
		defaultNormalTextColor = normalText;
	}
	$('#normalText').val(defaultNormalTextColor);
	$('#textToRead').css('color', defaultNormalTextColor);
	$('#normalText').bind
	(
		'change',
		function(event, value)
		{
			var normalTextColor = event.target.value;
			$('#textToRead').css('color', normalTextColor);
			$.cookie('normalText', normalTextColor);
			cookieConsent();
		}
	);
	
	var highlightBackground = $.cookie('highlightBackground');
	if(highlightBackground != undefined)
	{
		defaultHighlightBackgroundColor = highlightBackground;
	}
	$('#highlightBackground').val(defaultHighlightBackgroundColor);
	$('.highlight').css('background-color', defaultHighlightBackgroundColor);
	$('#highlightBackground').bind
	(
		'change',
		function(event, value)
		{
			var highlightBackgroundColor = event.target.value;
			$('.highlight').css('background-color', highlightBackgroundColor);
			$.cookie('highlightBackground', highlightBackgroundColor);
			cookieConsent();
		}
	);
	
	var highlightText = $.cookie('highlightText');
	if(highlightText != undefined)
	{
		defaultHighlightTextColor = highlightText;
	}
	$('#highlightText').val(defaultHighlightTextColor);
	$('.highlight').css('color', defaultHighlightTextColor);
	$('#highlightText').bind
	(
		'change',
		function(event, value)
		{
			var highlightTextColor = event.target.value;
			$('.highlight').css('color', highlightTextColor);
			$.cookie('highlightText', highlightTextColor);
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
			
			firstWord = 0;
			
			highlightText();
		}
	);
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
	$.cookie('consent', true);
}