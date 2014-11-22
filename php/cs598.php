<?php session_start(); ?>
<?php
$con=mysqli_connect("localhost","root","cs411gogo","CS411Test");
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$id =  $_POST['username'];
$pw = $_POST['passwd'];
$md5_password = md5($pw);
//error_handling($id, $pw);
$sql = "SELECT * FROM users where username = '".$id."' and password = '".$md5_password."'";
$result = mysqli_query($con, $sql);
$ret = mysqli_fetch_array($result);
if(is_null($ret)){
  echo "log in failed";
  var_dump($sql);
  echo '<meta http-equiv=REFRESH CONTENT=1;url=index.php>';
}else{
  //session_start();
  $_SESSION['username'] = $id;
  echo '<meta http-equiv=REFRESH CONTENT=1;url=member.php>';
}
?>



