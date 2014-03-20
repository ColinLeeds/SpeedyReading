// JavaScript Document
$(document).ready
(
	function()
	{
		$('#speedReadingWhat').bind('click',
			function()
			{
				$('#speedReadingWhatAnswer').slideToggle('slow');
			});
			
		$('#speedReadingWhatHide').bind('click',
			function()
			{
				$('#speedReadingWhatAnswer').slideUp('slow');
			});
	}
)