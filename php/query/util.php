<?php
function dot($v1, $v2) {
  if(!is_array($v1) || !is_array($v2)) {
    echo "VECTOR ERROR(util.php): dot can only take vectors as input\n";
    return null;
  }

  if(count($v1) != count($v2)) {
    echo "VECTOR ERROR(util.php): dot input vectors length not equal\n";
    return null;
  }

  $len = count($v1);
  $ret = 0.0;
  for ($i = 0; $i < $len; $i ++) {
    $ret = $ret + $v1[$i] * $v2[$i];
  }

  return $ret;

}
?>
