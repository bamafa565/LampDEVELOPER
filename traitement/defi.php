<?php 
    
    $id= $_POST['id'];
    $nom = $_POST['nm'];
    $prenom = $_POST['pr'];
    $adress = $_POST['ad'];
    $email= $_POST['email'];
    $genre = $_POST['gen'];
    $tel = $_POST['tel'];
    try{
    $bdd= new pdo('mysql:host=localhost;dbname=boutique','root','bamafa196');
    }catch(Exception $e){
        die("erreur:".$e ->getMessage());
    }
    $req = $bdd->exec("INSERT INTO clients(id_client,nom,prenom,adresse,email,genre,numtel_cli) VALUES('$id','$nom','$prenom','$adress','$email','$genre','$tel')");

     echo"enregistrement reussi";





    
    ?>

    <a href="client.php">afficher la table me</a>