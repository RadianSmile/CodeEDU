<?php
//$url = $_POST["url"];
//http://stackoverflow.com/questions/845220/get-the-last-modified-date-of-a-remote-file


// 十區設定 http://jikky.pixnet.net/blog/post/18213326-php4%E8%88%87php5%E7%9A%84%E6%99%82%E5%8D%80%E8%A8%AD%E5%AE%9A

//date_default_timezone_set( "Asia/Taipei" );

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
$fp = fopen('http://radiansmile.github.io/CodeEDU/final_11/play.html', 'r', false, $context);
$r = stream_get_meta_data($fp);
//print_r ($r);
//echo ("<br>");

$lastMod = $r["wrapper_data"][3] ;
echo $lastMod;
//$time = strtotime($lastMod);
//echo gettype($time) . "\n" ;
//echo "last-modify :".$time ;
//echo "time " . time();


//fpassthru($fp);



fclose($fp);

/** PHP 4 not availiable 
$r ;
$curl = curl_init("http://radiansmile.github.io/CodeEDU/final_11/play.html");
curl_setopt($curl, CURLOPT_NOBODY, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_FILETIME, true);
$result = curl_exec($curl);
if ($result === false) {
    die (curl_error($curl)); 
}
$timestamp = curl_getinfo($curl, CURLINFO_FILETIME);
if ($timestamp != -1) { //otherwise unknown
   $r["timenum"] = $timestamp ;
	 $r["timestamp"] = date("Y-m-d H:i:s", $timestamp); //etc
	 echo json_encode($r);
} 
**/

?>
