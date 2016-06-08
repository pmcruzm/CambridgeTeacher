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
var filter_segmento=-1;
var filter_type1=-1;
var filter_type2=-1;

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


jQuery.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
    }
});


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
	if (jQuery('#all-catalogo .content-catalogo').is(":visible") ) {
		//Ajustamos cuadros 
		jQuery('#all-catalogo .content-catalogo div.inside-b-book').each(function() {
			var ancho_box=jQuery(this).width();
			jQuery(this).css('height',ancho_box);
		});
		//Ajustamos etiqueta sample
		jQuery('#all-catalogo .content-catalogo .enl-book img').each(function() {
			if(jQuery(this).parent().find('span').length>0){
				var alto_img=jQuery(this).height();
				jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20});
			}
		});
		
		//Calculamos demos y evalución para todos
		var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo]').length;
		var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre]').length;
		
		//Asignamos valores a enlaces correspondientes 
		jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
		jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
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

	//Ajustamos altura de detalle de producto
	if (jQuery('.cover-detalle img').is(":visible") ) {
		var w_img=jQuery('.cover-detalle img').width();
		var h_img=jQuery('.cover-detalle img').height();
		//Añadimos altura y anchura al div padre
		jQuery('.cover-detalle img').parent().width(w_img);
		jQuery('.cover-detalle img').parent().height(h_img);
		//Miramos si tiene span
		if(jQuery('.cover-detalle img').parent().find('span').length>0){
			jQuery('.cover-detalle img').parent().find('span').css({bottom:20});
		}
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
			alert(hash);
			jQuery('body').stop().clearQueue().scrollTo(jQuery('#'+hash),800,{axis:'y',easing:'easeInOutExpo'});
			
			//Mirar si estamos en catalogo y es un filtro
		}
	});

	//Menú principal y submenús
	jQuery(document).on('click','.language_opc > a',function(e){
		e.preventDefault();
		//Miramos si ya está desplegado el de login
		if(jQuery('.login_opc').hasClass('active')){
			jQuery('.login_opc').removeClass('active');
			jQuery('.login_opc').find('.desplegable').hide().css({opacity:0});
		}
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},400,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},400);
		}
	});

	//Activar el menú de Login
	jQuery(document).on('click','.login_opc > a',function(e){
		e.preventDefault();
		//Miramos si ya está desplegado el de idioma
		if(jQuery('.language_opc').hasClass('active')){
			jQuery('.language_opc').removeClass('active');
			jQuery('.language_opc').find('.desplegable').hide().css({opacity:0});
		}
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},400,function(){jQuery(this).hide();jQuery('.login_box').show();jQuery('.forget_box').hide();});
			jQuery(this).parent().removeClass('active');
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},400);
		}
	});

	//Activar desplegable usuario logado
	jQuery(document).on('click','.user_opc > a',function(e){
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
		
		//Miramos si está activo el filtro de demo
		if(jQuery('#selectores-filtros a[data-filter-type=demo]').hasClass('active')){
			filter_type1='demo';
		}else{
			filter_type1=-1;
		}
		//Miramos si está actimo el filtro de evaluación 
		if(jQuery('#selectores-filtros a[data-filter-type=centre]').hasClass('active')){
			filter_type2='centre';
		}else{
			filter_type2=-1;
		}
		//console.log(filter_segmento+'--'+filter_type1+'--'+filter_type2);
		filter_catalogo(filter_segmento,filter_type1,filter_type2);	
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
			//Llamamos a la función de validar (id formulario y contenedor errores)
			var result=validate_form('#registro-form');
			if(result==1){
				e.preventDefault();
				send_form=0;
			}
		}
	});

	//Eliminar marco de error cuando se hace click sobre un input con error
	jQuery(document).on('focus','form input,form textarea',function(event){
		event.preventDefault();
		if(jQuery(this).attr('type')!='submit'){
			if(jQuery(this).hasClass('error')){
				jQuery(this).removeClass('error');
			}
		}
	});

	//Detectar cambios en checkbox
	jQuery(document).on('change','form input[type=checkbox]',function(event){
		event.preventDefault();
			//alert(jQuery(this).attr('class'));
			if(jQuery(this).hasClass('validation-rule-checkbox-profe')){
				jQuery('form .single-radio input[type=checkbox]').removeClass('error');
			}else{
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

	//Comprobación del login/forgot-password vía AJAX
	jQuery('#form-login,#form-forgot-password').on('submit', function(e){
		e.preventDefault();

		var f = jQuery(this);

		jQuery.ajax({
		url: f.attr('action'),
		method: f.attr('method'),
		data: f.serialize(),
		dataType: 'json',
		success : function(response) {
			if(response.errorCode == 0){
				//success message
				jQuery('.feedback', f).text(response.message).show(400);
				if(response.redirect){window.top.location = response.redirect;}
			}else{
				//some error message
				jQuery('.feedback', f).text(response.message).show(400);
			}
		 }
	   });

	});

	//Mostrar formulario de resetar password
	jQuery(document).on('click','.reset_password',function(e){
		e.preventDefault();
		jQuery('.login_box').fadeOut(600,function(){
			jQuery('.forget_box').fadeIn(600);
		});

	});

	//Desplegar los cuadros de faqs
	jQuery(document).on('click','.enl-faq',function(e){
		e.preventDefault();
		if(jQuery(this).hasClass('active')){
			jQuery(this).parent().find('.desplegable').slideToggle(400,function(){
				jQuery(this).parent().find('.enl-faq').removeClass('active');
			});
		}else{
			jQuery(this).parent().find('.desplegable').slideToggle(400,function(){
				jQuery(this).parent().find('.enl-faq').addClass('active');
			});
		}

	});

	//Desplegar los faqs según link
	jQuery(document).on('click','.new-user',function(e){
		e.preventDefault();
		jQuery('.btns-faqs a').removeClass('active');
		jQuery(this).addClass('active');
		jQuery('.old-user-ct').fadeOut(400,function(){
			jQuery('.new-user-ct').fadeIn(400);
			//Cerrar todos los desplegables
			jQuery('.old-user-ct .desplegable').hide();
			jQuery('.old-user-ct a').removeClass('active');
		});

	});

	//Desplegar los faqs según link
	jQuery(document).on('click','.old-user',function(e){
		e.preventDefault();
		jQuery('.btns-faqs a').removeClass('active');
		jQuery(this).addClass('active');
		jQuery('.new-user-ct').fadeOut(400,function(){
			jQuery('.old-user-ct').fadeIn(400);
			//Cerrar todos los desplegables
			jQuery('.new-user-ct .desplegable').hide();
			jQuery('.new-user-ct a').removeClass('active');
		});
	});

	//Mostrar tabs de detalle de producto
	jQuery(document).on('click','.single-tab a',function(e){
		e.preventDefault();
		if(!jQuery(this).hasClass('active')){
			jQuery('.single-tab a').removeClass('active');
			jQuery(this).addClass('active');
			var box_open='.'+jQuery(this).attr('rel');
			jQuery('.cont-tabs > div:visible').fadeOut(400,function(){
				jQuery(box_open).fadeIn(400);
			});
		}
	});
	
	//En catalogo mostrar todo o mi colección
	jQuery(document).on('click','.tipo_cat a',function(e){
		e.preventDefault();
		if(!jQuery(this).hasClass('active')){
			jQuery('.tipo_cat a').removeClass('active');
			jQuery(this).addClass('active');
			var id_enl=jQuery(this).attr('id');
			//alert(id_enl);
			if(id_enl=='btn-mi-coleccion'){
				//Ocultamos filtros cabecera
				jQuery('.filter_cat').fadeOut(400,function(){
					jQuery('.filter_cat a').removeClass('active');	
				});
				//Cerramos todos y mostramos mi coleccion 
				jQuery('#all-catalogo').fadeOut(400,function(){
					jQuery('#selectores-filtros a').removeClass('active');
					jQuery('#my-catalogo').css({'opacity':0}).show();
					/****Hacemos calculos****/ 
					//Tamaño de cuadros
					if (jQuery('#my-catalogo .content-catalogo').is(":visible") ) {
						
						jQuery('#my-catalogo .content-catalogo div.inside-b-book').each(function() {
							var ancho_box=jQuery(this).width();
							jQuery(this).css('height',ancho_box);
						});
						
						jQuery('#my-catalogo .content-catalogo .enl-book img').each(function() {
							if(jQuery(this).parent().find('span').length>0){
								var alto_img=jQuery(this).height();
								jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20});
							}
						});
						
						//Animamos aparición cuadros
						jQuery('#my-catalogo').animate({opacity:1},400);
					}
					//Etiqueta Sample
				});
			}else{
				jQuery('#my-catalogo').fadeOut(400,function(){
					//Reseteamos los filtros
					filter_segmento=-1;
					filter_type1=-1;
					filter_type2=-1;	
					filter_catalogo(filter_segmento,filter_type1,filter_type2);	
					jQuery('#all-catalogo').fadeIn(400,function(){
						//Calculamos subfiltros
					});
					jQuery('.filter_cat').fadeIn(400);
				});
			}
		}
	});
	
	//Cuando pulsas sobre un filter de primer nivel 
	jQuery(document).on('click','.filter_cat a',function(e){
		e.preventDefault();
		if(!jQuery(this).hasClass('active')){
			jQuery('.filter_cat a').removeClass('active');
			jQuery(this).addClass('active');
			filter_segmento=jQuery(this).attr('data-filter-segment');
			filter_type1=-1;
			filter_type2=-1;	
			filter_catalogo(filter_segmento,filter_type1,filter_type2);
			jQuery('#selectores-filtros a').removeClass('active');	
		}else{
			jQuery('.filter_cat a').removeClass('active');
			filter_segmento=-1;
			filter_type1=-1;
			filter_type2=-1;
			//Mostramos todos los elementos
			filter_catalogo(filter_segmento,filter_type1,filter_type2);	
			jQuery('#selectores-filtros a').removeClass('active');
		}
	}); 
	
	//Cuando queremos desplegar Mastercode
	jQuery(document).on('click','.box-mastercode a',function(e){
		e.preventDefault();
		var h_content=jQuery('#content').outerHeight();
		jQuery('#modal-mastercode').height(h_content);
		jQuery('#modal-mastercode').fadeIn(400);
	}); 
	
	//Enviar formulario de mastercode
	jQuery(document).on("submit","#form-mastercode", function(e) {
		if(send_form==0){
			send_form=1;
			//Limpiamos errores si no es la primera vez
			jQuery(".errores").html("");
			//Llamamos a la función de validar (id formulario y contenedor errores)
			var result=validate_form('#form-mastercode');
			if(result==1){
				e.preventDefault();
				send_form=0;
			}
		}
	});
	
	//Cerrar modal Mastercode
	jQuery(document).on("click",".close-modal", function(e) {
		e.preventDefault();
		jQuery('#modal-mastercode').fadeOut(400);	
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
			if (jQuery('#all-catalogo .content-catalogo').is(":visible") ) {
				jQuery('#all-catalogo .content-catalogo div.inside-b-book').each(function() {
					var ancho_box=jQuery(this).width();
					jQuery(this).css('height',ancho_box);
				});
				//Ajustamos etiqueta sample
				jQuery('#all-catalogo .content-catalogo .enl-book img').each(function() {
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20});
					}
				});
			}
			
			//Ajustamos altura de los cuadros de catalogo
			if (jQuery('#my-catalogo .content-catalogo').is(":visible") ) {
				jQuery('#my-catalogo .content-catalogo div.inside-b-book').each(function() {
					var ancho_box=jQuery(this).width();
					jQuery(this).css('height',ancho_box);
				});
				//Ajustamos etiqueta sample
				jQuery('#my-catalogo .content-catalogo .enl-book img').each(function() {
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
			
			//Ajustamos modal si está abierto
			if (jQuery('#modal-mastercode').is(":visible") ) {
				var h_content=jQuery('#content').outerHeight();
				jQuery('#modal-mastercode').height(h_content);
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

//Funcion para mostrar los elementos filtrados
function filter_catalogo(segmento,type1,type2){
	var allCourses = jQuery('#all-catalogo .content-catalogo div[data-type]');

    allCourses.show();
	
	if(segmento==-1 & type1==-1 & type2==-1 ){
		allCourses.show();
	}else{
		if(type1!=-1) {
				allCourses.each(function(i, e){
					if( jQuery(e).data('type') == 'demo' ) {
						jQuery(e).hide();
					}
				});
		}
	
		if(type2!=-1) {
				allCourses.each(function(i, e){
					if( jQuery(e).data('type') == 'centre' ) {
						jQuery(e).hide();
					}
				});
		}
		
		//Filtro de primer nivel 
		if(segmento!=-1) {
			
			allCourses.each(function(i, e){
					if( jQuery(e).data('segment') != segmento ) {
						jQuery(e).hide();
					}
			});
			
			//Calculamos demos y evalución para los correspondientes al filtro
			var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo][data-segment='+segmento+']').length;
			var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre][data-segment='+segmento+']').length;
				
			//Asignamos valores a enlaces correspondientes 
			jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
			jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
		}else{
			
			//Calculamos demos y evalución para todos
			var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo]').length;
			var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre]').length;
				
			//Asignamos valores a enlaces correspondientes 
			jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
			jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
		}
		
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

			//Busca todos los checkbox de profesor
			if(jQuery(id).find('.validation-rule-checkbox-profe').length > 0){
				var error_checkbox_profe=1;
				jQuery(id).find('.validation-rule-checkbox-profe').each(function() {
					if(jQuery(this).prop("checked")){
						error_checkbox_profe=0;
						return true;
					}

				});
				if(error_checkbox_profe==1){
					jQuery('.validation-rule-checkbox-profe').addClass('error');
				}
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

			if(error_checkbox_profe==1){
				var message=jQuery(id).find('.validation-rule-checkbox-profe').attr('data-error-msg');
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
			if(error_empty==1 || error_checkbox==1 || error_mail || error_password==1 || error_radio==1 || error_checkbox_profe==1){
				return 1;
			}else{
				return 0;
			}
}

