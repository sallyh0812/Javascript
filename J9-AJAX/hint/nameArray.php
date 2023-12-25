<?php
header("Access-Control-Allow-Origin: *");
// Fill up array with names
$a[]="Anna";
$a[]="Brittany";
$a[]="Cinderella";
$a[]="Diana";
$a[]="Eva";
$a[]="Fiona";
$a[]="Gunda";
$a[]="Hege";
$a[]="Inga";
$a[]="Johanna";
$a[]="Kitty";
$a[]="Linda";
$a[]="Nina";
$a[]="Ophelia";
$a[]="Petunia";
$a[]="Amanda";
$a[]="Raquel";
$a[]="Cindy";
$a[]="Doris";
$a[]="Eve";
$a[]="Evita";
$a[]="Sunniva";
$a[]="Tove";
$a[]="Unni";
$a[]="Violet";
$a[]="Liza";
$a[]="Elizabeth";
$a[]="Ellen";
$a[]="Wenche";
$a[]="Vicky";

if (isset($_GET["key"]))
	$q=$_GET["key"]; //get the parameter from URL
else if (isset($_POST["key"]))
	$q=$_POST["key"];
else
	$q="";

//lookup all hints from array if length of q>0
if (strlen($q) > 0) {
	$hint="";
	for($i=0; $i<count($a); $i++) {
		if (strtolower($q)==strtolower(substr($a[$i],0,strlen($q)))) {
			if ($hint=="") { $hint=$a[$i]; }
			else { $hint=$hint." , ".$a[$i]; }
		}
	}
}

// Set output to "no suggestion" if no hint were found
// or to the correct values
if ($hint == "") { $hint="no suggestion"; }

//output the response
echo $hint;
?>