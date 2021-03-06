<?php
date_default_timezone_set("Asia/Bangkok");

$period = 1;
$now = (string)floor(((int)date("H"))/$period)*$period;
$fileName = $now.date("dmY");
$fileName = "./data/".$fileName.".txt";

if (!file_exists($fileName)) {
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => 'https://ncovi.huynhhieu.com/api.php?code=external',
        CURLOPT_USERAGENT => 'nghia',
        CURLOPT_SSL_VERIFYPEER => false
    ));
    
    $resp = curl_exec($curl);
    echo($resp);
    curl_close($curl);
    
    $myfile = fopen($fileName, "w") or die("Unable to open file!");
    fwrite($myfile, $resp);
    fclose($myfile);
} else {
    $f = fopen($fileName,"r");
    echo fread($f,filesize($fileName));
    fclose($f);

}
?>