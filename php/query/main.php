<?php
include 'query.php';

$c = new Query("../db/restaurant_index_5.json", "../db/category.json", "../db/mapping.json", "../db/rating.json");

$arr = array();
array_push($arr, array("name" => "Big Grove Tavern"));
array_push($arr, array("name" => "Ryans"));
$ret = $c -> retrieveRating($arr);
echo json_encode($ret) . "\n";
?>
