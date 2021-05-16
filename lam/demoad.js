(function() {
    
    var filename = 'https://tympanus.net/codrops/adpacks/demoad.css?' + new Date().getTime();
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);

    let cdaSpots = ['ad1','ad2'];
    let cdaSpot = cdaSpots[Math.floor(Math.random() * cdaSpots.length)];

    switch (cdaSpot) {
        case "ad1":
            var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B25600467.299822224;dc_trk_aid=492786319;dc_trk_cid=148388561;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;ltd=';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
            var cdaImgAlt = 'Mailchimp';
            var cdaText = "Grow sales by using the smart tools in our all-in-one Marketing Platform. Try it for free.";
            break;
        /*
            let cdaVariations = ['v1','v2','v3'];
            let cdaVariation = cdaVariations[Math.floor(Math.random() * cdaVariations.length)];
            
            switch (cdaVariation) {
                case "v1":
                    var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B25600467.299679615;dc_trk_aid=492786325;dc_trk_cid=148388558;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;ltd=';
                    var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
                    var cdaImgAlt = 'Mailchimp';
                    var cdaText = "Guide customers along the path to purchase with our award-winning platform. Starting at $14.99/mo.";
                    break;
                case "v2":
                    var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B25600467.299679618;dc_trk_aid=492786322;dc_trk_cid=148523184;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;ltd=';
                    var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
                    var cdaImgAlt = 'Mailchimp';
                    var cdaText = "Supercharge your marketing across design, automations, analytics, and more, using our marketing smarts.";
                    break;
                case "v3":
                    var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B25600467.299822224;dc_trk_aid=492786319;dc_trk_cid=148388561;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;ltd=';
                    var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
                    var cdaImgAlt = 'Mailchimp';
                    var cdaText = "Grow sales by using the smart tools in our all-in-one Marketing Platform. Try it for free.";
                    break;
                default:
                    var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B25600467.299822224;dc_trk_aid=492786319;dc_trk_cid=148388561;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;ltd=';
                    var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
                    var cdaImgAlt = 'Mailchimp';
                    var cdaText = "Grow sales by using the smart tools in our all-in-one Marketing Platform. Try it for free.";
                    break;
            }
            */
        case "ad2":
            var cdaLink = 'https://srv.buysellads.com/ads/long/x/T6RCWXITTTTTTT3LMMACTTTTTTTCFMI7KTTTTTTTKDGFAYTTTTTTTW4MCWSWYJL3Q77C5BZYZ6SCNLSC2MAC4SBPP2TE';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/uploads/2021/04/EditorX.png';
            var cdaImgAlt = 'Editor X';
            var cdaText = "Create dynamic and powerful web experiences with responsive CSS combined with smooth drag & drop.";
            break;
        case "ad3":
            var cdaLink = 'http://go.thoughtleaders.io/2188920210425';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/uploads/2021/04/Porkbun.png';
            var cdaImgAlt = 'Porkbun';
            var cdaText = "Add an elegant touch to your website with a free .design domain name.";
            break;
        default:
            var cdaLink = 'https://www.elegantthemes.com/affiliates/idevaffiliate.php?id=17972_5_1_16';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/Divi_Carbon.jpg';
            var cdaImgAlt = 'Divi';
            var cdaText = "From our sponsor: Divi is more than just a WordPress theme, it's a completely new website building platform. Try it.";
    }

    var cda = document.createElement('div');
    cda.id = 'cdawrap';
    cda.style.display = 'none';
    cda.innerHTML = '<a href="'+cdaLink+'" class="carbon-img" target="_blank" rel="noopener"><img src="'+cdaImg+'" alt="'+cdaImgAlt+'" border="0" height="100" width="130"></a><a href="'+cdaLink+'" class="carbon-text" target="_blank" rel="noopener">'+cdaText+'</a><div class="cda-footer"><a class="carbon-poweredby" href="https://tympanus.net/codrops/advertise/" target="_blank" rel="noopener">Become a sponsor</a><span class="cda-remove" id="cda-remove">Close</span></div>';
    document.getElementsByTagName('body')[0].appendChild(cda);

    setTimeout(function() {
        cda.style.display = 'block';
    }, 1000);

    document.getElementById('cda-remove').addEventListener('click', function(e) {
        cda.style.display = 'none';
        e.preventDefault();
    });
    
})();