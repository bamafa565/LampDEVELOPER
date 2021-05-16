<html>

<head>
	<meta charset="utf-8">
    <title>
       <h1>bamafa shop</h1> 
    </title>
 <!-- <link rel="stylesheet" href="pr.css"> -->
</head>
<style>
	body{
        text-align: center;
        padding: 20px;
    }
    h1{
        background-image:url('img/1.jpg');
        background-color: rgba(255, 255, 255, 0.85);
        padding: 50px;
    }
    /* aside{
        border: 1px solid none;
        background-color: rgba(255, 255, 255, 0.726);
    } */

    table{
        position: relative;
        height: 500px;
        width: 760px;
        margin-left:300px;
        background-color: rgb(251, 253, 253);
        padding:50px;
	}
	#ab{
    direction:grid;
    grid-row: 20% 20% 60% ;
    
        height: 150px;
        width:150px;
    }
</style>
<body>
	
<h1>LISTE DES PRODUITS</h1>
<div id="ab">
        <img src="img/twitter.png" alt="" height="100px" width="100px">@papamaguey <br>
        <img src="img/person1.png" alt=""height="100px" width="100px">whatsapp:76 733 41 35 <br>
        <img src="img/person2.png" alt="" height="100px" width="100px">contact:77 8929658 <br>
    </div>
<table border="solid 1px">
<form action="new_product.php" method="POST">
	<tr>
  <td> REFERENCE PRODUITS:<input type="text" name="a" VALUE="0"> </td>
</tr>
<tr>
<td> NOM DU PRODUIT: <input type="text" name="b"></td>
</tr>
<tr>
<td> QUANTITE PRODUIT:<input type="text" name="c"></td>
</tr>
<tr>
<td> prix:<input type="text" name="f"></td>
</tr>
<tr>
<td> DESCRIPTION: <input type="text" name="d"></td>
</tr>
<tr>
<td>DATE AJOUTE: <input type="date" name="e"></td>
	
</tr>
<tr>
<td>DATE MODIFICATION: <input type="date" name="g"></td>
	
</tr>
<tr>
     &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;     <td> <input type="submit" value="AJOUTER"></td>
</tr>
			</form>
			</table>
			
            <a href="deconnec.php">SE DECONNECTER</a>
</body></html>