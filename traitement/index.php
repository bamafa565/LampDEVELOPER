<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    
<link rel="stylesheet" href="../bootstrap-4.4.1-dist\css\bootstrap.min.css">
	<link rel="stylesheet" href="../fontawesome-free-5.15.3-web\css\all.css">
	
	<link rel="stylesheet" href="../DataTables/datatables.css">
	<script src="../jquery/jquery-3.6.0.min.js"></script>
	<script type="text/javascript" src="../DataTables/datatables.js"></script>
	<script src="../bootstrap-4.4.1-dist\js\bootstrap.js"></script>
<!-- <link rel="stylesheet" type="text/css" href="t.css"> -->
</head>
<style>
    td{
       border: solid 1px;
       width:90px;
  } 
   header>*{
       margin:TOP;
   }
   
    table > *{
        padding:50px;
        border-spacing: 15px;
    }
</style>
<body>
<table class="container" id="table_id">

<?php
$ind;
include "connetion_db.php"; //inclusion de la page qui me permet de me connecter avec ma base de donnees
$req="select quantite,article,prixUnitaire,date_livraison,idCommande from commande";


if($result=$mb->query($req)){
 while($ind=$result->fetch(PDO::FETCH_NUM)){
        
       
echo "<table id=\"table_id\">

<tr><th>quantite</th><td>".$ind[0]."</td><th>article</th><td>".$ind[1]."</td><th>prixUnitaire</th><td>".$ind[2]."</td><th>PRIXTOTAL</th><td>".$ind[2]*$ind[0]."</td></tr></table><br>";
        
    }
}else{
    echo "aucun enregistrement ";
}
echo"</fieldset>";
?>
 </table>

 <script>
	$(document).ready(function () {
		$('#table_id').DataTable();
	} );
</script>

</body>
</html>