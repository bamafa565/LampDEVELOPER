<?php

if(session_status()===PHP_SESSION_NONE){
    session_start();
    
}
try{
    $mb= new PDO('mysql:host=localhost;dbname=angular','root','');
    }catch(Exception $e){
        die("erreur:" .$e->getMessage());
    }



?>