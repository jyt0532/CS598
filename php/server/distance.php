<?php
include 'filter.php';

$rest = array("latlng" => "(40.10938, -88.228225)");
$pair = new Pair($rest, 3);
$restaurants = array($pair);

$user = array("lat" => "40.118374", "lng" => "-88.2207168");
$filter = new Filter(1000, $user);
print_r($filter -> filter($restaurants));
  
?>
