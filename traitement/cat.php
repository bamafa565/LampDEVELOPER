<?php
    $nom=$_POST['nom'];
    $descri=$_POST['des'];
include "connetion_db.php";
$req=$mb->prepare("INSERT INTO categorie(nom,description) VALUES(:nom,:description)");
$req->execute(array('nom'=>$nom,
'description'=>$descri
));
if($req==true){
    echo'ajout bien effectuer';
}
else{
    header("Location:categorie.php");
}
?>
<a href="categorie.php">retour a la page precedentes</a>