<?php
$reference= $_POST['a'];
$nom = $_POST['b'];
$quantite = $_POST['c'];
$prix=$_POST['f'];
$description = $_POST['d'];
$date_ajout= $_POST['e'];
$date_modifi=$_POST['g'];
include "connetion_db.php";
if(isset( $_POST['a'])&& isset($_POST['b'])&& isset($_POST['c'])&&isset($_POST['f'])&&isset($_POST['d'])&& isset($_POST['e'])&& isset($_POST['g'])){
    $req = $mb->prepare("UPDATE produit SET
    id_produit= :id_produit,lib_produi=:lib_produi,
    quantite=:quantite,prix=:prix,description=:description,
    date_ajout=:date_ajout, date_modifi=:date_modifi
    where id_produit=$reference");
     $req->execute(array('id_produit'=>$reference,
     'lib_produi'=>$nom,
     'quantite'=>$quantite,
     'prix'=>$prix,
     'description'=>$description,
     'date_ajout'=>$date_ajout,
     'date_modifi'=>$date_modifi));
     if($req==true){
         echo"bismillah";
       header("Location:index.php");
     }else{
       echo"aucun ajout effectuer";
    }
     }else{
     header("Location:produit.php");
   }
    ?>