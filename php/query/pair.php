<?php

class Pair {
  public $first = null;
  public $second = null;
  function __construct($elem1, $elem2) {
    $this -> first = $elem1;
    $this -> second = $elem2;
  }

  /**
   * static sorting compare function, from big to small
   */
  public static function cmp($p1, $p2) {
    if($p1 -> second == $p2 -> second) {
      return 0;
    }
    return $p1->second < $p2->second ? 1 : -1;
  }

}
?>
