/**********************
FUNCIONES JQUERY
Autor:Pedro de la Cruz
Fecha: 10-8-2015
Cliente: Cervecear
***********************/


/**********************
VARIABLES
**********************/
var slider_l_post;

//Eventos para dispositivos móviles
var ua = navigator.userAgent,
event = (ua.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) ? "touchstart" : "click";
var device='none';
if(ua.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)){
	device='yes';
	//Event change orientation device
	window.addEventListener('orientationchange', doOnOrientationChange);
}

jQuery.noConflict();


jQuery(window).load(function(){
	
	//Ajustamos altura de los bloques de noticias
	if (jQuery('#list-news').is(":visible") ) {
		var heights = jQuery('#list-news div.inside-new').map(function ()
		{
			return jQuery(this).outerHeight();
		}).get(),
		//Obtenemos tamaño max de los cuadros
		maxHeight = Math.max.apply(null, heights);
		jQuery('#list-news div.inside-new').each(function() {
			jQuery(this).css('height',maxHeight+30);
		});
	}
	
	//Ajustamos altura de los cuadros de catalogo
	if (jQuery('#content-catalogo').is(":visible") ) {
		jQuery('#content-catalogo div.inside-b-book').each(function() {
			var ancho_box=jQuery(this).width();
			jQuery(this).css('height',ancho_box);
		});
	}
	
	//Ajustamos altura de los cuadros de catalogo
	if (jQuery('#content-catalogo').is(":visible") ) {
		jQuery('#content-catalogo .enl-book img').each(function() {
			if(jQuery(this).parent().find('span').length>0){
				var alto_img=jQuery(this).height();
				jQuery(this).parent().find('span').css({bottom:-alto_img/2});
			}
		});
	}

});

jQuery(document).ready(function(){

	//Obtenemos altura y anchura del navegador
	h_win=jQuery(window).height();
	w_win=jQuery(window).width();
	
	//Volver el scroll a top
	/*jQuery('body').scrollTo( "0px", 0,function(){
		//Pillar anclas de la url si las hay
		var hash = window.location.hash.substring(1);
		if(hash!=""){
			alert('hash');
			jQuery('body').stop().clearQueue().scrollTo(jQuery('#'+hash),800,{axis:'y',easing:'easeInOutExpo'});
		}
	});*/
	
	//Menú principal y submenús
	jQuery(document).on('click','.language_opc a',function(e){
		e.preventDefault();
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},400,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');		
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},400);	
		}
	});
	
	//Activar el menú de Login
	jQuery(document).on('click','.login_opc a',function(e){
		e.preventDefault();
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},400,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');		
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},400);	
		}
	});
	
	//Activar desplegable usuario logado 
	jQuery(document).on('click','.user_opc a',function(e){
		e.preventDefault();
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},400,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');		
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},400);	
		}
	});
	
	//Carrusel de Mi Catalogo 
	/*jQuery( '#slider1' ).lemmonSlider({
			infinite: true
	});*/
	
	
	//Filtros de la página de catálogo 
	jQuery(document).on('click','#selectores-filtros a',function(e){
        e.preventDefault();
		
		if(jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
		}else{
			jQuery(this).addClass('active');
		}

        var allCourses = jQuery('#content-catalogo div[data-type]');

        allCourses.show();

        if( jQuery(this).parent().find('a[data-filter-type="demo"]').hasClass('active') ) {
            allCourses.each(function(i, e){
                if( jQuery(e).data('type') == 'demo' ) {
                    jQuery(e).hide();
                }
            });
        }

        if( jQuery(this).parent().find('a[data-filter-type="centre"]').hasClass('active') ) {
            allCourses.each(function(i, e){
                if( jQuery(e).data('type') == 'centre' ) {
                    jQuery(e).hide();
                }
            });
        }

    });

	
	//Volver el scroll a top
	/*jQuery('body').scrollTo( "0px", 0,function(){
		//Pillar anclas de la url si las hay
		var hash = window.location.hash.substring(1);
		if(hash!=""){
			alert('hash');
			jQuery('body').stop().clearQueue().scrollTo(jQuery('#'+hash),800,{axis:'y',easing:'easeInOutExpo'});
		}
	});*/
	

	
	//Responsive de los vídeos de Youtube 
	/*if ( jQuery(".single-youtube").is(":visible") ) {
		jQuery(".single-youtube").fitVids();
	}*/
	
	
	
	//Ajustar altura de los destacados de la home 
	/*if ( jQuery("#carrusel-last-post").is(":visible") ) {
		jQuery('.bg-single-post').each(function() {
			var w_single=jQuery(this).width();
			jQuery(this).height(w_single);
		});
	}*/
	
	
	//Menú principal y submenús
	/*jQuery(document).on("mouseenter","#main_menu > li", function(e) {
		jQuery(this).addClass('active');
		//Comprobamos si tiene desplegable
		if(jQuery(this).find('.desplegable').length>0){
			jQuery(this).find('.desplegable').slideToggle();	
		}
	}).on("mouseleave","#main_menu > li", function(e) {
		jQuery(this).removeClass('active');
		if(jQuery(this).find('.desplegable').length>0){
			jQuery(this).find('.desplegable').slideToggle();	
		}
	});*/
	

	jQuery(window).scroll(control_scroll);



	//Evento para capturar el resize de la ventana
	jQuery( window ).resize(function() {
			//Obtenemos altura y anchura del navegador
			var h_win_r=jQuery(this).height();
			var w_win_r=jQuery(this).width();
			
			//Ajustamos altura de los bloques de noticias
			if (jQuery('#list-news').is(":visible") ) {
				var heights = jQuery('#list-news div.inside-new').map(function ()
				{
					return jQuery(this).outerHeight();
				}).get(),
				//Obtenemos tamaño max de los cuadros
				maxHeight = Math.max.apply(null, heights);
				jQuery('#list-news div.inside-new').each(function() {
					jQuery(this).css('height',maxHeight+30);
				});
			}
			
			//Ajustamos altura de los cuadros de catalogo
			if (jQuery('#content-catalogo').is(":visible") ) {
				jQuery('#content-catalogo div.inside-b-book').each(function() {
					var ancho_box=jQuery(this).width();
					jQuery(this).css('height',ancho_box);
				});
			}
			
			//Ajustamos altura de los cuadros de catalogo
			if (jQuery('#content-catalogo').is(":visible") ) {
				jQuery('#content-catalogo .enl-book img').each(function() {
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:-alto_img/2});
					}
				});
			}
	

	});


});


/*************************
FUNCIONES JAVASCRIPT
**************************/

//Función para capturar eventos scroll
function control_scroll(e){
  //Variable de scroll
  var scrollAmount = jQuery(window).scrollTop();
  var h_foot=jQuery('#footer').height();

  //Obtenemos altura y anchura del navegador
  h_win=jQuery(window).height();
  w_win=jQuery(window).width();

  //Añadir Cookie si se hace scroll a +100px
  if(scrollAmount>100){
 		
  }


}


//Función para el cambio de orientación
function doOnOrientationChange()
  {
    switch(window.orientation)
    {
      case -90:
      case 90:

	 
        break;
      default:

	

        break;
    }
  }

