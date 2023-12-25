<?php
header("Access-Control-Allow-Origin: *");
//sleep(1);
$theTimeIs = getdate(time()); 
$theHour = $theTimeIs['hours']; 
$theMinute = $theTimeIs['minutes']; 
$theSecond = $theTimeIs['seconds']; 
if($theHour > 12){ 
	$theHour = $theHour - 12; 
	$dn = "PM"; 
}else{ 
	$dn = "AM"; 
} 
echo "$theHour:$theMinute:$theSecond $dn"; 
?>    

