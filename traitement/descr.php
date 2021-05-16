<?php   
$ref= $_POST['a'];
include "connetion_db.php";
$req="select description from produit where id_produit= $ref";
if($result=$mb->query($req)){
       while($ind=$result->fetch(PDO::FETCH_NUM)){
    echo "<table border solid 1px;><th>description:</th><td>".$ind[0]."</td></table><br>";
            
        }
    }
?>
<br>
<a href="index.php">LISTE DES PRODUITS</a>