<?php
include 'query.php';

$c = new Query("../db/category.json", "../db/restaurant_index_5.json", "../db/mapping.json", "../db/rating.json");

$arr = array();
array_push($arr, "Buffets");
$ret = $c -> getAllRestaurantWithCategory($arr);
$rating = $c -> retrieveRating($ret);
foreach($rating as $r) {
  echo $r -> first["name"] . " ";
  echo $r -> second . "\n";
}
?>
