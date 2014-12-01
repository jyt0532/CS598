<?php
include '../query/query.php';

$q = new Query("../db/category.json");

echo json_encode($q -> getAllCategory());

?>
