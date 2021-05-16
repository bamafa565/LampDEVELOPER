<!DOCTYPE html>
<html>
<head>
	<title>compte</title>
</head>
<style>
    body{
        text-align: center;
        padding: 100px;
    }
    #header{
        background-image:url('img/1.jpg') no-repeat;
        padding: 20px;
    }
    aside{
        border: 1px solid none;
        background-color: rgba(255, 255, 255, 0.30);
    }
    form{
       /* background-color: rgb(130, 135,140);*/
        padding: 20px;
        
    }
</style> 

<body>
    <header id="header">
        
    
        <aside>
        <h1><strong>BIENVENUE CHEZ BAMAFA SHOP</strong></h1>
        <p>chez nous la qualite vous sera garantie a 100%</p>
        
        </aside>
    </header><br>
    <hr>
    <br><br><br>
    
<form action="defi.php" method="post" id="form">
<div>
                        ID: <input type="text" name="id" value="0">
</div>
<br>
<div>
         NOM : <input type="text" name="nm">
</div>
<br>
<div>
                PRENOM: <input type="text" name="pr">
</div>
<br>
<br>
<div>
                ADRESSE: <input type="text" name="ad">
</div>
<br>
<div>
                EMAIL: <input type="email" name="email">
</div>
<br>
<div>
                <p>GENRE:</p>  &nbsp;&nbsp;
              masculin :<input type="radio" name="gen" value="M">&nbsp;&nbsp;&nbsp;
            feminin :<input type="radio" name="gen" value="F">
</div>
<br>
<div>
                numero tel: <input type="text" name="tel">
</div>
<br>
<br>

<div>
     <input type="submit" value="se connecter">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     <input type="submit" value="annuler">
</div>




</form>
</body>
</html>