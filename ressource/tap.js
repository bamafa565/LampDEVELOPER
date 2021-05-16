(function () {
    
var afficherOnglet=function(def){
      var div=def.parentNode.parentNode.parentNode
          var li=def.parentNode

      if(li.classList.contains('active')){
        return false
      }
            //retrait de la class active
          div.querySelector('.taps .active').classList.remove('active')
               //ajoute de la class active 
          li.classList.add('active')

            //lalalalalala
          div.querySelector('.tap-content.active').classList.remove('active')
          div.querySelector(def.getAttribute('href')).classList.add('active')

}

  var al=document.querySelectorAll('.taps  a')
  for (var i = 0; i < al.length; i++) {
    al[i].addEventListener('click',function (e) {
      // body...
      afficherOnglet(this)

    })
  }

  
  
          var hash=window.location.hash

          var a=document.querySelector('a[href="'+hash+'"]')

          if(a!==null && !a.classList.contains('active')){
            afficherOnglet(a)
          }
})()