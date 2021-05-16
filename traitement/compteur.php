<?php
function comp(){
    $fichier=dirname(__DIR__).DIRECTORY_SEPARATOR.'pprojet'.DIRECTORY_SEPARATOR.'date(Y-m-d)';
    $compteur=1;
    if(file_exists($fichier)){
        $compteur=(int)file_get_contents($fichier);
        $compteur++;
    }   
    file_put_contents($fichier,$compteur);
}

function nbre_vues(){
    $fichier=dirname(__DIR__).DIRECTORY_SEPARATOR.'pprojet'.DIRECTORY_SEPARATOR.'date(Y-m-d)';
    return file_get_contents($fichier);
}




?>