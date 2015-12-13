$(document).ready(function(){
	$('form').submit(function(e){
		var pw1 = $('#pw1').val();
		var pw2 = $('#pw2').val();
		
		if(pw1 != pw2)
		{
			alert('wrong pw check');
			e.preventDefault();
		}
	})
});