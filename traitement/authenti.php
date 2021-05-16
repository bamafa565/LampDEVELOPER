<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    

</head>
<body id="connec">
<?php 
include "connetion_db.php";
  setcookie($_POST['a']);
$_SESSION['email']=$_POST['a']; 
$req=$mb->prepare('SELECT id from admin where email=:email and passwd=:passwd ');
 $req->execute(array(
     'email'=>$_POST['a'],'passwd'=>$_POST['b']));
$req= $req->fetch();
if($req==true){
   // echo 'yes';
 header("Location:../index.html");
}
else{
  // $invalid="le nom d'utilisateur ou le password est incorrect!!";
    echo "no";
}
// require_once dirname(__DIR__).DIRECTORY_SEPARATOR.'pprojet'.DIRECTORY_SEPARATOR.'compteur.php';
// comp();



 ?>
 
 
</body>
</html>