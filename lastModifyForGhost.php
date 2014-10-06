<?php
error_reporting(0);
$url = $_GET["url"];

if ( isset($_GET["url"])){
	$url = $_GET["url"];
}else{
	echo "noVal" ;
	return false ;
	
}
$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Accept-language: en\r\n" .
              "Cookie: foo=bar\r\n"
  )
);
$context = stream_context_create($opts);

/* Sends an http request to www.example.com
   with additional headers shown above */
$fp = fopen($url, 'r', false, $context);
$r = stream_get_meta_data($fp);
//print_r ($r);

$lastMod = $r["wrapper_data"][3] ;
echo $lastMod;
fclose($fp);
?>
