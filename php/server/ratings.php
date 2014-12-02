<?php
  include '../query/query.php';
  include '../query/util.php';

  $raw_category = $_POST["category"];
  $category = json_decode($raw_category);
  $raw_preference = $_POST["preference"];
  $preference = json_decode($raw_preference);
  if(!is_array($preference)) {
      echo "parameter parse error\n";
      return;
  }



  $q = new Query("../db/category.json", "../db/restaurant_index_5.json", "../db/mapping.json", "../db/rating.json", "../db/RestaurantAddress.json");

  $restaurants = $q -> getAllRestaurantWithCategory($category);
  $restaurants = $q -> convertRestaurantAddressToCoord($restaurants);
  $ratingPairs = $q -> retrieveRating($restaurants);
  foreach($ratingPairs as &$pair) {
    $pair -> second = dot($pair -> second, $preference);
  }

  usort($ratingPairs, "Pair::cmp");

  echo json_encode($ratingPairs);

?>
