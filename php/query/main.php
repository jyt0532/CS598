<?php
include 'query.php';

$c = new Query("../db/restaurant_index_5.json", "../db/category.json", "../db/IDMapping.json");

echo $c -> getAllCategory();
?>
