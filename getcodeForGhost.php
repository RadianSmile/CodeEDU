<?php
if (function_exists('strripos') == false) {
    function strripos($haystack, $needle) {
        return strlen($haystack) - strpos(strrev($haystack), $needle);
    }
}

//echo 'Current PHP version: ' . phpversion();
error_reporting(0);;
$url ;
if (isset($_POST['url']) &&  $_POST['url'] != '')
{
	$url = $_POST['url'];
}else {
	//$url = "http://radiansmile.github.io/CodeEDU/final_11/play.html";
	//$url = "http://stackoverflow.com/questions/5975526/iframe-onload-eventt";
	//$url = "http://github.com/radiansmile";
	//$url = "http://radiansmile.github.io/CodeEDU/final_11/final_11.pde";
	
//	echo $_POST['url'] ;
	echo "no val";
	return false ;
}




if (!file_get_contents($url)){ // 這邊在確定 file get content 能不能存取到 play.html
//	echo file_get_contents($url);
	echo "no play";
	return false;
}else{  // 這邊在確定是不是為 github.io
	$parse = parse_url($url);
	$domain = $parse['host'];
	$host = substr($domain, strpos($domain, ".") +1);
	if ($host != "github.io"){
		echo "wrong host" ;
		return false;
	}
}

	//echo $host ;


$root = substr($url, 0 , strripos($url, "/") ) ;//. "/";

//echo $filename = substr ()




/* 這裡是沒有支援 php5 domElement 的關係 所以註解掉
	$doc = new DomDocument;
	// We need to validate our document before refering to the id
	$doc->validateOnParse = true;
	libxml_use_internal_errors(true);
	$doc->loadHtml(file_get_contents($url));
	libxml_clear_errors();
	
	$a = $doc->getElementById("pde");
	if (gettype ($a) === "NULL"){
		echo "wrong play" ;
		return false;
	}else{
	}
	$b = $root . $a->getAttribute("data-processing-sources");
*/

//** 取代，因此使用以下的方式：

//- 流程：抓取頭 抓取.pde 去除空白
$play =   file_get_contents ($url);//'<canvas data-processing-sources="  ggg.pde ggg">'; // //
$dataTitle = 'data-processing-sources="';
$dataTitleLen = strlen($dataTitle);
$pdeEnd = '.pde';
$pdeEndLen = strlen($pdeEnd);
$dataSeperate = " ";

$pdeStartPos = strpos($play,$dataTitle);
if ($pdeStartPos === false){echo "wrong play"; return false;} 
$pde = substr($play,$pdeStartPos + $dataTitleLen);
$pdeEndPos = strpos($pde,$pdeEnd);
$pde = substr ($pde , 0 , $pdeEndPos + $pdeEndLen);

$pde = preg_replace('/\s+/', '', $pde);

$seperatePos = strpos($pde, $dataSeperate) ;
if ($seperatePos === false) {
	$pdeUrl = $root.$pde ;
}else{
	$pde = substr($pde,0,$seperatePos);
	$pdeUrl = $root.$pde ;
}







$content = file_get_contents($pdeUrl) ;
echo  $content ? $content  : 'no code';


/**Rn** http://stackoverflow.com/questions/5045598/getting-elements-of-a-div-from-another-page-php  */
?>


