<?php
$reference=$_POST['a'];
include "connetion_db.php";
$req="delete from produit 
where id_produit = $reference";
$result=$mb->query($req);
if($result==true){
    echo"suppression bien effectuer";
    header("Location:index.php");
}else{
    echo"aucun suppression effectuer";
}
?>
