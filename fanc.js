$(function(){

	// ページ内を加工(草→w)
	$("body").html(
		$("body").html().replace( /草/g, "w" )
	);
});