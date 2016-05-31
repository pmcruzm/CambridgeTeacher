/**********************
FUNCIONES JQUERY
Autor:Pedro de la Cruz
Fecha: 18-5-2015
Cliente: Cambridge Teacher
***********************/


/**********************
VARIABLES
**********************/
var slider_l_post;
var send_form=0;
var max_items=8;

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
		//Ocultamos bloques 
		jQuery('#list-news a.new-single').hide().css('visibility','visible');
		//Mostramos los 8 primeros  
		var cont=0;
		jQuery('#list-news a.new-single').each(function() {
			if(cont<max_items){
				jQuery(this).addClass('visible').css('display','block');
				cont++;
			}else{
				return true;
			}
		});	
		//Miramos si nos hay más noticias por mostrar 
		var all_elem=jQuery('#list-news a.new-single').length;
		var all_elem_v=jQuery('#list-news a.new-single.visible').length;
		//console.log(all_elem+'--'+all_elem_v);
		if((all_elem-all_elem_v)==0){jQuery('.btn-more').hide();}
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
				jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20});
			}
		});
	}
	
	//Ajustamos Shot de la home
	if (jQuery('#show-examples').is(":visible") ) {
		var heights = jQuery('#show-examples div.shot-box').map(function ()
		{
			return jQuery(this).outerHeight();
		}).get(),
		//Obtenemos tamaño max de los cuadros
		maxHeight = Math.max.apply(null, heights);
		jQuery('#show-examples div.shot-box').each(function() {
			jQuery(this).css('height',maxHeight);
		});
	}

});

jQuery(document).ready(function(){

	//Obtenemos altura y anchura del navegador
	h_win=jQuery(window).height();
	w_win=jQuery(window).width();
	
	//Volver el scroll a top
	jQuery('body').scrollTo( "0px", 0,function(){
		//Pillar anclas de la url si las hay
		var hash = window.location.hash.substring(1);
		if(hash!=""){
			alert('hash');
			jQuery('body').stop().clearQueue().scrollTo(jQuery('#'+hash),800,{axis:'y',easing:'easeInOutExpo'});
		}
	});
	
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
	if (jQuery('.carrusel-coleccion').is(":visible") ) {
		jQuery('.carrusel-list').slick({
		  dots: true,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 1,
		  centerMode: false,
		  variableWidth: true,
		  slidesToScroll: 2
		});
	}
	
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
	
	//Ayudas de los registros (over) 
	jQuery(document).on("mouseenter",".help-box a", function(e) {
		e.preventDefault();	
		//Comprobamos si tiene desplegable
		jQuery(this).parent().find('.content-help').fadeIn(600);
	}).on("mouseleave",".help-box a", function(e) {
		e.preventDefault();	
		jQuery(this).parent().find('.content-help').removeClass('active');
		jQuery(this).parent().find('.content-help').fadeOut(600);
	});
	
	//Ayudas de los registros click
	jQuery(document).on('click','.help-box a',function(e){
		e.preventDefault();	
		if(jQuery(this).parent().find('.content-help').hasClass('active')){
			jQuery(this).parent().find('.content-help').removeClass('active');
			jQuery(this).parent().find('.content-help').fadeOut(600);
		}else{
			jQuery(this).parent().find('.content-help').addClass('active');	
			jQuery(this).parent().find('.content-help').fadeIn(600);
		}
	});
	
	//Enviar formulario de registro
	jQuery(document).on("submit","#registro-form", function(e) {
		if(send_form==0){
			send_form=1;
			//Limpiamos errores si no es la primera vez
			jQuery(".errores").html("");
			//Llamamos a la funciÃ³n de validar (id formulario y contenedor errores)
			var result=validate_form('#registro-form');
			if(result==1){
				e.preventDefault();
				send_form=0;
			}
		}
	});
	
	//Eliminar marco de error cuando se hace click sobre un input con error
	jQuery(document).on('focus','form input,form textarea,form input[type=checkbox]',function(event){
		event.preventDefault();
		if(jQuery(this).attr('type')!='submit'){
			if(jQuery(this).hasClass('error')){
				jQuery(this).removeClass('error');
			}
		}
	});
	
	//Mostramos las primeras noticias visibles
	/*if (jQuery('#list-news').is(":visible") ) {
		var cont=0;
		jQuery('#list-news a.new-single').each(function() {
			if(cont<max_items){
				jQuery(this).addClass('visible').css('display','block');
				cont++;
			}else{
				return true;
			}
		});		
	}*/
	
	//Mostrar más noticias 
	jQuery(document).on('click','.btn-more',function(e){
		e.preventDefault();	
		var cont=0;
		jQuery('#list-news a.new-single').each(function() {
			if(!jQuery(this).hasClass('visible')){
				if(cont<max_items){
					jQuery(this).addClass('visible').css('display','block');
					cont++;
				}else{
					return true;
				}
			}
		});	
		//Miramos si nos hay más noticias por mostrar 
		var all_elem=jQuery('#list-news a.new-single').length;
		var all_elem_v=jQuery('#list-news a.new-single.visible').length;
		//console.log(all_elem+'--'+all_elem_v);
		if((all_elem-all_elem_v)==0){jQuery('.btn-more').hide();}		
	});

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
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20});
					}
				});
			}
			
			//Ajustamos Shot de la home
			if (jQuery('#show-examples').is(":visible") ) {
				jQuery('#show-examples div.shot-box').removeAttr('style');
				var heights = jQuery('#show-examples div.shot-box').map(function ()
				{
					return jQuery(this).outerHeight();
				}).get(),
				//Obtenemos tamaño max de los cuadros
				maxHeight = Math.max.apply(null, heights);
				jQuery('#show-examples div.shot-box').each(function() {
					jQuery(this).css('height',maxHeight);
				});
			}
	

	});


});


/*************************
FUNCIONES JAVASCRIPT
**************************/

//Ajusta tamaño de noticias
function ajusta_news(){
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
  
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//Funcion para validar genéricamente un formulario
function validate_form(id){

		//Busca todos los campos requeridos de texto
			if(jQuery(id).find('.validation-rule-empty').length > 0){
				var error_empty=0;
				jQuery(id).find('.validation-rule-empty').each(function() {
					if(jQuery(this).is(":visible")){
					var res_campo=jQuery(this).val();
						if(res_campo==""){
							error_empty=1;
								jQuery(this).addClass('error').val('');
						}
					}

				});
			}

			//Busca todos los campos requeridos de mail
			if(jQuery(id).find('.validation-rule-mail').length > 0){
				var error_mail=0;
				jQuery(id).find('.validation-rule-mail').each(function() {
					if(jQuery(this).is(":visible")){
						var res_campo=jQuery(this).val();
						if((res_campo=="") || (res_campo!="" && validateEmail(res_campo)==false) ){
							error_mail=1;
								jQuery(this).addClass('error').val('');
						}
					}

				});
			}

			//Busca todos los campos requeridos de codigo postal
			if(jQuery(id).find('.validation-rule-password').length > 0){
				var error_password=0;
				//Comprobamos que uno de los 2 no está vacío
				if(jQuery('.init_password').val()!="" && jQuery('.repeat_password').val()!=""){
					var txt_ini=jQuery('.init_password').val();
					var txt_rept=jQuery('.repeat_password').val();
					if(txt_ini!=txt_rept){
						error_password=1;
						jQuery('.init_password').addClass('error').val('');
						jQuery('.repeat_password').addClass('error').val('');
					}else{
						if(txt_ini.length < 8){
							error_password=1;
							jQuery('.init_password').addClass('error').val('');
							jQuery('.repeat_password').addClass('error').val('');
						}
					}
				}else{
					error_password=1;
					jQuery('.init_password').addClass('error').val('');
					jQuery('.repeat_password').addClass('error').val('');
				}
			}

			//Busca todos los campos requeridos checkbox
			if(jQuery(id).find('.validation-rule-checkbox').length > 0){
				var error_checkbox=0;
				jQuery(id).find('.validation-rule-checkbox').each(function() {
					if(!jQuery(this).prop("checked")){
						error_checkbox=1;
						jQuery(this).addClass('error');
					}

				});
			}

			//Busca todos los campos requeridos radio
			if(jQuery(id).find('.validation-rule-radio').length > 0){
				var error_radio=0;
				var value_radio=jQuery(id).find('input[name=user_type]:checked').val();
				if (typeof value_radio == 'undefined') {
					error_radio=1;
					jQuery(id).find('input[name=user_type]').addClass('error');
				}
				//console.log(error_radio);
			}


			//Error general campos vacíos
			if(error_empty==1){
				var message=jQuery(id).attr('data-error-msg');
				jQuery('.errores').append('<p>'+message+'</p>');
			}

			if(error_checkbox==1){
				var message=jQuery(id).find('.validation-rule-checkbox').attr('data-error-msg');
				jQuery('.errores').append('<p>'+message+'</p>');
			}

			if(error_radio==1){
				var message=jQuery(id).find('.validation-rule-radio').attr('data-error-msg');
				jQuery('.errores').append('<p>'+message+'</p>');
			}

			//Errores password
			if(error_password==1){
				var message=jQuery(id).find('.validation-rule-password').attr('data-error-msg');
				jQuery('.errores').append('<p>'+message+'</p>');
			}

			if(error_mail==1){
				var message=jQuery(id).find('.validation-rule-mail').attr('data-error-msg');
				jQuery('.errores').append('<p>'+message+'</p>');
			}

			//Salida
			if(error_empty==1 || error_checkbox==1 || error_mail || error_password==1 || error_radio==1){
				return 1;
			}else{
				return 0;
			}
}

