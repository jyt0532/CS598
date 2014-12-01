<?php
  include '../query/query.php';
  include '../query/util.php';

  $raw_category = $_POST["category"];
  $category = json_decode($raw_category);
  $raw_preference = $_POST["preference"];
  $preference = json_decode($raw_preference);


  $q = new Query("../db/restaurant_index_5.json", "../db/category.json", "../db/mapping.json", "../db/rating.json");

  $restaurants = $q -> getAllRestaurantWithCategory($category);
  $ratingPairs = $q -> retrieveRating($restaurants);
  foreach($ratingPairs as &$pair) {
    $pair -> second = dot($pair -> second, $preference);
  }

  usort($ratingPairs, "Pair::cmp");

  echo json_encode($ratingPairs);

?>
