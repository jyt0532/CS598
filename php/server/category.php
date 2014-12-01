<?php
include '../query/query.php';

$q = new Query("../db/restaurant_index_5.json", "../db/category.json", "../db/IDMapping.json");

echo json_encode($q -> getAllCategory());

?>
