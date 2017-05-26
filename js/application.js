/**********************
FUNCIONES JQUERY
Autor:Pedro de la Cruz
Fecha: 18-5-2016
Cliente: Cambridge Teacher
***********************/


/**********************
VARIABLES
**********************/
var slider_l_post;
var max_items=8;
var init_items=8;
var filter_segmento=-1;
var filter_type1=-1;
var filter_type2=-1;
var hash_active=0;
var block_filter=0;
var s_slicks=0;

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


(function(jQuery){
	"use strict";

	var getUrlParameter = function(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
			return null;
		}
	}

	if( ! jQuery.getUrlParameter ) {
		jQuery.getUrlParameter = getUrlParameter;
	}

})(jQuery);


jQuery(window).load(function(){

	//Ajustamos altura de los bloques de noticias
	if (jQuery('#list-news').is(":visible") ) {
		//Ocultamos bloques
		jQuery('#list-news a.new-single').hide().css('visibility','visible');
		//Mostramos los 8 primeros
		var cont=0;
		jQuery('#list-news a.new-single').each(function() {
			if(cont<init_items){
				jQuery(this).addClass('visible').css('display','block');
				cont++;
			}else{
				return true;
			}
		});

		//Ajustamos altura
		var heights = jQuery('#list-news a.new-single.visible div.inside-new').map(function ()
		{
			return jQuery(this).outerHeight();
		}).get(),
		//Obtenemos tamaño max de los cuadros
		maxHeight = Math.max.apply(null, heights);
		jQuery('#list-news a.new-single.visible div.inside-new').each(function() {
			jQuery(this).css('height',maxHeight+30);
		});

		//Miramos si nos hay más noticias por mostrar
		var all_elem=jQuery('#list-news a.new-single').length;
		var all_elem_v=jQuery('#list-news a.new-single.visible').length;
		//console.log(all_elem+'--'+all_elem_v);
		if((all_elem-all_elem_v)==0){jQuery('.btn-more').hide();}else{jQuery('.btn-more').show();}
	}

	//Ajustamos altura de los cuadros de catalogo
	if (jQuery('#all-catalogo .content-catalogo').is(":visible") ) {
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
		var mitad_ancho=133;
		//Añadimos altura y anchura al div padre
		jQuery('.cover-detalle img').parent().width(w_img);
		jQuery('.cover-detalle img').parent().height(h_img);
		//Miramos si tiene span
		if(jQuery('.cover-detalle img').parent().find('span').length>0){
			jQuery('.cover-detalle img').parent().find('span').css({bottom:20});
		}
		//Ajustamos en la izquierda
		jQuery('.cover-detalle img').parent().css({'left':(133-(w_img/2))});
	}

	//Ocultamos flechas según contenido
	if (jQuery('.carrusel-coleccion').is(":visible") ) {
		var lengh_items=0;
		var block_item=0;
		jQuery('.carrusel-list div.item').each(function() {
			if(jQuery(this).hasClass('slick-active')){
				block_item=1;
			}
			if(block_item==1){
				lengh_items+=jQuery(this).outerWidth();
			}
		});

		//Mostramos/ocultamos las flechas si es mayor
		if(lengh_items >= jQuery(window).width()){
			jQuery('.slick-prev').show().css({'visibility':'visible'});
			jQuery('.slick-next').show().css({'visibility':'visible'});
		}else{
			jQuery('.slick-prev').hide().css({'visibility':'hidden'});
			jQuery('.slick-next').hide().css({'visibility':'hidden'});
		}
	}

});

jQuery(document).ready(function(){

	//Obtenemos altura y anchura del navegador
	h_win=jQuery(window).height();
	w_win=jQuery(window).width();

	//Redirección a la página mobile
	if(device=="yes" && w_win<767 && jQuery('meta[property="mobile-redirect"]').attr('content')=="true"){
		var url_block=jQuery('meta[property="mobile-redirect-url"]').attr('content');
		window.top.location = url_block;
	}

	//Volver el scroll a top
	jQuery('body').scrollTo( "0px", 0,function(){
		//Pillar anclas de la url si las hay
		var hash = window.location.hash.substring(1);
		if(hash!=""){
			//alert(hash);
			if(hash.indexOf('segment') > -1){
				if (jQuery('#all-catalogo').is(":visible") ) {
					//Mirar si estamos en catalogo y es un filtro
					var array_hash=hash.split("-");
					filter_segmento=array_hash[1];
					//Filtramos
					filter_catalogo(filter_segmento,filter_type1,filter_type2);
					//Marcamos opcion en el filtro de primer nivel
					jQuery('.filter_cat a[data-filter-segment='+filter_segmento+']').addClass('active');
					jQuery('.tipo_cat a').removeClass('active');
					hash_active=1;
					//Activamos Lazyload para las imágenes
					//jQuery("img.lazy").lazyload({skip_invisible : false});
				}
			}else{
				jQuery('body').stop().clearQueue().scrollTo(jQuery('#'+hash),800,{axis:'y',easing:'easeInOutExpo'});
			}
		}
	});

	if (jQuery('#all-catalogo .content-catalogo').is(":visible") ) {

		//Ajustamos cuadros
		var heights = jQuery('#all-catalogo .content-catalogo div.inside-b-book').map(function ()
		{
			return jQuery(this).outerWidth();
		}).get(),
		//Obtenemos tamaño max de los cuadros
		maxWidth = Math.max.apply(null, heights);
		jQuery('#all-catalogo .content-catalogo div.inside-b-book').each(function() {
			jQuery(this).css('height',maxWidth);
		});

		if(hash_active!=1){
			//Llamamos a los cuadros de TODOS
			filter_catalogo(filter_segmento,filter_type1,filter_type2);

			//Calculamos demos y evalución para todos
			var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo]').length;
			var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre]').length;

			//Asignamos valores a enlaces correspondientes
			jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
			if(all_demos==0){jQuery('#selectores-filtros a[data-filter-type=demo]').addClass('bloqueado');}
			jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
			if(all_evaluacion==0){jQuery('#selectores-filtros a[data-filter-type=centre]').addClass('bloqueado');}
		}
	}

	//Menú principal y submenús
	jQuery(document).on('click','.language_opc > a',function(e){
		e.preventDefault();
		//Miramos si ya está desplegado el de login
		if(jQuery('.login_opc').hasClass('active')){
			jQuery('.login_opc').removeClass('active');
			jQuery('.login_opc').find('.desplegable').hide().css({opacity:0});
		}
		//Miramos si ya está desplegado el de profile
		if(jQuery('.user_opc').hasClass('active')){
			jQuery('.user_opc').removeClass('active');
			jQuery('.user_opc').find('.desplegable').hide().css({opacity:0});
		}
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},0,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},0);
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
			jQuery(this).parent().find('.desplegable').animate({opacity:0},0,function(){jQuery(this).hide();jQuery('.login_box').show();jQuery('.forget_box').hide();});
			jQuery(this).parent().removeClass('active');
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},0);
		}
	});

	//Activar desplegable usuario logado
	jQuery(document).on('click','.user_opc > a',function(e){
		e.preventDefault();
		//Miramos si ya está desplegado el de idioma
		if(jQuery('.language_opc').hasClass('active')){
			jQuery('.language_opc').removeClass('active');
			jQuery('.language_opc').find('.desplegable').hide().css({opacity:0});
		}
		if(jQuery(this).parent().hasClass('active')){
			jQuery(this).parent().find('.desplegable').animate({opacity:0},0,function(){jQuery(this).hide();});
			jQuery(this).parent().removeClass('active');
		}else{
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.desplegable').show().animate({opacity:1},0);
		}
	});

	//Carrusel de Mi Catalogo
	if (jQuery('.carrusel-coleccion').is(":visible") ) {
		jQuery('.carrusel-list').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 1,
		  centerMode: false,
		  variableWidth: true,
		  slidesToScroll: 2
		});
	}

	//Asignamos nº de slicks item a la variables
	s_slicks=jQuery('.slick-slide').length;

	//Filtros de la página de catálogo
	jQuery(document).on('click','#selectores-filtros a',function(e){
		e.preventDefault();

		if(!jQuery(this).hasClass('bloqueado')){

			var opc_btn=jQuery(this).attr('data-filter-type');

			if(opc_btn=='demo' && jQuery('#selectores-filtros a[data-filter-type=centre]').hasClass('active')){
				jQuery('#selectores-filtros a[data-filter-type=centre]').removeClass('active')
			}

			if(opc_btn=='centre' && jQuery('#selectores-filtros a[data-filter-type=demo]').hasClass('active')){
				jQuery('#selectores-filtros a[data-filter-type=demo]').removeClass('active')
			}

			//Comprobamos activación y desacctivación de filtro
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
		}
	});

	//Over libros catalogo
	jQuery(document).on("mouseenter",".inside-b-book", function(e) {
		e.preventDefault();
		if(device!='yes'){
			jQuery(this).addClass('over-plus');
		}
	}).on("mouseleave",".inside-b-book", function(e) {
		e.preventDefault();
		if(device!='yes'){
			jQuery(this).removeClass('over-plus');
		}
	});

	//Over libros mi coleccion
	jQuery(document).on("mouseenter",".carrusel-list .item", function(e) {
		e.preventDefault();
		if(device!='yes'){
			jQuery(this).addClass('over-item');
		}
	}).on("mouseleave",".carrusel-list .item", function(e) {
		e.preventDefault();
		if(device!='yes'){
			jQuery(this).removeClass('over-item');
		}
	});

	//Ayuda en catalogo plus click
	/*jQuery(document).on('click','.inside-b-book',function(e){
		e.preventDefault();
		if(device=="true"){
			if(jQuery(this).hasClass('over-plus')){
				jQuery(this).removeClass('over-plus');
			}else{
				jQuery(this).addClass('over-plus');
			}
		}
	});*/

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

	jQuery('form[data-validate="true"]').on('submit', function(event){
		if( ! validateForm.validate(event) ) {
			event.preventDefault();
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
	if (jQuery('#list-news').is(":visible") ) {
		if(w_win<1921){max_items=12;init_items=12;}
		if(w_win<1441){max_items=8;init_items=8;}
		if(w_win<1024){max_items=6;init_items=6;}
		if(w_win<768){max_items=4;init_items=6;}
		/*var cont=0;
		jQuery('#list-news a.new-single').each(function() {
			if(cont<max_items){
				jQuery(this).addClass('visible').css('display','block');
				cont++;
			}else{
				return true;
			}
		});*/
	}

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
			//Removemos las alturas anteriores
			jQuery('#list-news a.new-single.visible div.inside-new').removeAttr('style');
			var heights = jQuery('#list-news a.new-single.visible div.inside-new').map(function ()
			{
					return jQuery(this).outerHeight();
			}).get(),
			//Obtenemos tamaño max de los cuadros
			maxHeight = Math.max.apply(null, heights);
			jQuery('#list-news a.new-single.visible div.inside-new').each(function() {
				jQuery(this).css('height',maxHeight+30);
			});
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
			filter_segmento=-1;
			filter_type1=-1;
			filter_type2=-1;
			filter_catalogo(filter_segmento,filter_type1,filter_type2);
			jQuery('#selectores-filtros a').removeClass('active');
			jQuery('.filter_cat a').removeClass('active');
			//Eliminamos hash
			removeHash();
		}
	});

	//Cuando pulsas sobre un filter de primer nivel
	jQuery(document).on('click','.filter_cat a',function(e){
		e.preventDefault();
		//console.log(block_filter);
		if(block_filter==0){
			block_filter=1;
			if(!jQuery(this).hasClass('active')){
				jQuery('.filter_cat a').removeClass('active');
				jQuery(this).addClass('active');
				filter_segmento=jQuery(this).attr('data-filter-segment');
				filter_type1=-1;
				filter_type2=-1;
				filter_catalogo(filter_segmento,filter_type1,filter_type2);
				jQuery('#selectores-filtros a').removeClass('active');
				//Eliminamos la etiqueta de todos
				jQuery('.tipo_cat a').removeClass('active');
				//Añadimos hash
				window.location.hash = '#segment-'+jQuery(this).attr('data-filter-segment');
			}else{
				jQuery('.filter_cat a').removeClass('active');
				filter_segmento=-1;
				filter_type1=-1;
				filter_type2=-1;
				//Mostramos todos los elementos
				filter_catalogo(filter_segmento,filter_type1,filter_type2);
				jQuery('#selectores-filtros a').removeClass('active');
				//Añadimos etiqueta de todos
				jQuery('.tipo_cat a').removeClass('active');
				jQuery('.tipo_cat a#btn-all-catalogo').addClass('active');
				//Eliminamos hash
				removeHash();
			}
		}
	});

	//Cuando queremos desplegar modal
	jQuery(document).on('click','*[data-modal-target]',function(e){
		e.preventDefault();
		var h_content=jQuery('#content').outerHeight();
		var modalTarget=jQuery(this).data('modal-target');
		jQuery(modalTarget).height(h_content);
		jQuery(modalTarget).fadeIn(400);
	});

	//La modal de descarga
	jQuery(document).on('click','*[data-modal-target="#modal-download"]',function(e){
		var modal = jQuery('#modal-download.modal');
		var tag   = jQuery(this).data('tag');
		var href  = jQuery(this).attr('href');
		jQuery('.download-tag', modal).text(tag);
		jQuery('.btn-primary', modal).attr('href',href);
	});

	//Cerramos la modal al clickar en la descarga
	jQuery(document).on('click','#modal-download .btn-primary',function(e){
		jQuery(this).closest('.modal').find('.close-modal').trigger('click');
	});

	//Enviar formulario de mastercode
	jQuery(document).on("submit","#form-mastercode", function(event) {
		var form = jQuery(this);
		event.preventDefault();

		if( validateForm.validate(event) ) {

			jQuery.ajax({
				url: form.attr('action'),
				method: form.attr('method'),
				data: form.serialize(),
				dataType: 'json',
				success : function(response) {
					if(response.errorCode == 0){
						//success message
						jQuery('.errores', form).text(response.message).show(400);
						if(response.redirect){window.top.location = response.redirect;}
					}else{
						//some error message
						jQuery('.errores', form).text(response.message).show(400);
					}
				}
			});

		}
	});

	//Cerrar modal
	jQuery(document).on("click",".close-modal", function(e) {
		e.preventDefault();
		jQuery('.modal').fadeOut(400);
	});

	//Miramos si la cookie de aceptación está creada
	if(jQuery.cookie('cambridge-teacher') == 'acepta'){
		//Ocultamos info cookies
		jQuery('.block-cookies').hide();
		var cod_GA=jQuery('meta[property="google-tracking-id"]').attr('content');
		//Añadimos GA
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-31155962-17' , 'auto');
		ga('send', 'pageview');
	}else{
		jQuery('.block-cookies').show();
	}

	//Cerrar cuadro info cookies
	jQuery(document).on('click','.close_c',function(event){
		event.preventDefault();
		jQuery('.block-cookies').fadeOut(600);
	});

	//Aceptar cookies en el cuadro
	jQuery(document).on('click','.btn-accept',function(e){
		e.preventDefault();
		jQuery('.block-cookies').fadeOut(600,function(){
			//Creamos la cookie de aceptación
			jQuery.cookie('cambridge-teacher', 'acepta', { expires: 365 * 10 ,path: '/' });
			var cod_GA=jQuery('meta[property="google-tracking-id"]').attr('content');
			//Añadimos GA
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-31155962-17' , 'auto');
			ga('send', 'pageview');
		});
	});

	jQuery(window).scroll(control_scroll);

	//Evento para capturar el resize de la ventana
	jQuery( window ).resize(function() {
			//Obtenemos altura y anchura del navegador
			var h_win_r=jQuery(this).height();
			var w_win_r=jQuery(this).width();

			//Ajustamos altura de los bloques de noticias
			if (jQuery('#list-news').is(":visible") ) {
				//Removemos las alturas anteriores
				jQuery('#list-news a.new-single.visible div.inside-new').removeAttr('style');
				var heights = jQuery('#list-news a.new-single.visible div.inside-new').map(function ()
				{
					return jQuery(this).outerHeight();
				}).get(),
				//Obtenemos tamaño max de los cuadros
				maxHeight = Math.max.apply(null, heights);
				jQuery('#list-news a.new-single.visible div.inside-new').each(function() {
					jQuery(this).css('height',maxHeight+30);
				});
			}

			//Ajustamos altura de los cuadros de catalogo
			if (jQuery('#all-catalogo .content-catalogo').is(":visible") ) {

				//Ajustamos altura de los cuadros de catalogo
				var heights = jQuery('#all-catalogo .content-catalogo div.inside-b-book').map(function ()
				{
					return jQuery(this).outerWidth();
				}).get(),
				//Obtenemos tamaño max de los cuadros
				maxWidth = Math.max.apply(null, heights);
				jQuery('#all-catalogo .content-catalogo div.inside-b-book').each(function() {
					jQuery(this).css('height',maxWidth);
				});

				//Ajustamos etiqueta sample
				jQuery('#all-catalogo .content-catalogo .enl-book img').each(function() {
					//Miramos span de Sample
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20}).show();
						jQuery(this).parent().find('span.featured').css({marginTop:Math.round(-alto_img/2)+13}).show();
						jQuery(this).parent().find('span.cover').css({marginTop:Math.round(-alto_img/2)+16}).show();
					}
					//Miramos cover check
					if(jQuery(this).parents('.single-box-book').hasClass('check')){
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13}).show();
					}else{
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13});
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
			if (jQuery('.modal').is(":visible") ) {
				var h_content=jQuery('#content').outerHeight();
				jQuery('.modal').height(h_content);
			}

			//Ocultamos flechas según contenido
			if (jQuery('.carrusel-coleccion').is(":visible") ) {
				var lengh_items=0;
				var block_item=0;
				jQuery('.carrusel-list div.item').each(function() {
					if(jQuery(this).hasClass('slick-active')){
						block_item=1;
					}
					if(block_item==1){
						lengh_items+=jQuery(this).outerWidth();
					}
				});

				//Mostramos/ocultamos las flechas si es mayor
				if(lengh_items >= jQuery(window).width()){
					jQuery('.slick-prev').show().css({'visibility':'visible'});
					jQuery('.slick-next').show().css({'visibility':'visible'});
				}else{
					jQuery('.slick-prev').hide().css({'visibility':'hidden'});
					jQuery('.slick-next').hide().css({'visibility':'hidden'});
				}
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
 		if(jQuery.cookie('cambridge-teacher') != 'acepta'){
			jQuery('.block-cookies').fadeOut(600,function(){
				//Creamos la cookie de aceptación
				jQuery.cookie('cambridge-teacher', 'acepta', { expires: 365 * 10 ,path: '/' });
				var cod_GA=jQuery('meta[property="google-tracking-id"]').attr('content');
				//Añadimos GA
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

				ga('create', 'UA-31155962-17' , 'auto');
				ga('send', 'pageview');
			});
		}
  }

}

//Funcion para mostrar los elementos filtrados
function filter_catalogo(segmento,type1,type2){
	var allCourses = jQuery('#all-catalogo .content-catalogo div[data-type]');

	//allCourses.show();

	if(segmento==-1 & type1==-1 & type2==-1 ){
		//Cerrarmos alert de 0 libros
		jQuery('.empty-catalogo').hide();

		allCourses.show();

		//Reseteamos botones
		jQuery('#selectores-filtros a[data-filter-type=centre]').removeClass('bloqueado');
		jQuery('#selectores-filtros a[data-filter-type=demo]').removeClass('bloqueado');

		//Calculamos demos y evalución para los correspondientes al filtro
		var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo]').length;
		var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre]').length;

		//Asignamos valores a enlaces correspondientes
		jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
		if(all_demos==0){jQuery('#selectores-filtros a[data-filter-type=demo]').addClass('bloqueado');}
		jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
		if(all_evaluacion==0){jQuery('#selectores-filtros a[data-filter-type=centre]').addClass('bloqueado');}

		//Desbloqueamos filtros
		block_filter=0;
		//Activamos Lazyload para las imágenes
		jQuery("img.lazy:visible").lazyload({
			threshold : 1,
			load : function()
			{
				//Miramos span de Sample
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20}).show();
						jQuery(this).parent().find('span.featured').css({marginTop:Math.round(-alto_img/2)+13}).show();
						jQuery(this).parent().find('span.cover').css({marginTop:Math.round(-alto_img/2)+16}).show();
					}
					//Miramos cover check
					if(jQuery(this).parents('.single-box-book').hasClass('check')){
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13}).show();
					}else{
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13});
					}
			}
		});
	}else{
		//Cerrarmos alert de 0 libros
		jQuery('.empty-catalogo').hide();

		allCourses.hide();

		//Filtro de primer nivel
		if(segmento!=-1) {

			allCourses.each(function(i, e){
					if( jQuery(e).data('segment') == segmento ) {
						if(type1==-1 && type2==-1){
							jQuery(e).show();
						}else{
							if( jQuery(e).data('type') == 'demo' && type1!=-1 ){
								jQuery(e).show();
							}
							if( jQuery(e).data('type') == 'centre' && type2!=-1 ){
								jQuery(e).show();
							}
						}
					}
			});

			//Reseteamos botones
			jQuery('#selectores-filtros a[data-filter-type=centre]').removeClass('bloqueado');
			jQuery('#selectores-filtros a[data-filter-type=demo]').removeClass('bloqueado');

			//Calculamos demos y evalución para los correspondientes al filtro
			var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo][data-segment='+segmento+']').length;
			var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre][data-segment='+segmento+']').length;

			//Asignamos valores a enlaces correspondientes
			jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
			if(all_demos==0){jQuery('#selectores-filtros a[data-filter-type=demo]').addClass('bloqueado');}
			jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
			if(all_evaluacion==0){jQuery('#selectores-filtros a[data-filter-type=centre]').addClass('bloqueado');}

			//Miramos si no hay libros
			if(all_demos==0 && all_evaluacion==0 ){
				jQuery('.empty-catalogo').show();
			}

			//Desbloqueamos filtros
			block_filter=0;
			//Activamos Lazyload para las imágenes
			jQuery("img.lazy:visible").lazyload({
				threshold : 1,
				load : function()
				{
					//Miramos span de Sample
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20}).show();
						jQuery(this).parent().find('span.featured').css({marginTop:Math.round(-alto_img/2)+13}).show();
						jQuery(this).parent().find('span.cover').css({marginTop:Math.round(-alto_img/2)+16}).show();
					}
					//Miramos cover check
					if(jQuery(this).parents('.single-box-book').hasClass('check')){
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13}).show();
					}else{
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13});
					}
				}
			});
		}else{

			allCourses.each(function(i, e){
					if(type1==-1 && type2==-1){
						jQuery(e).show();
					}else{
						if( jQuery(e).data('type') == 'demo' && type1!=-1 ){
							jQuery(e).show();
						}
						if( jQuery(e).data('type') == 'centre' && type2!=-1 ){
							jQuery(e).show();
						}
					}
			});

			//Reseteamos botones
			jQuery('#selectores-filtros a[data-filter-type=centre]').removeClass('bloqueado');
			jQuery('#selectores-filtros a[data-filter-type=demo]').removeClass('bloqueado');

			//Calculamos demos y evalución para todos
			var all_demos=jQuery('#all-catalogo .content-catalogo div[data-type=demo]').length;
			var all_evaluacion=jQuery('#all-catalogo .content-catalogo div[data-type=centre]').length;

			//Asignamos valores a enlaces correspondientes
			jQuery('#selectores-filtros a[data-filter-type=demo] strong').html(all_demos);
			if(all_demos==0){jQuery('#selectores-filtros a[data-filter-type=demo]').addClass('bloqueado');}
			jQuery('#selectores-filtros a[data-filter-type=centre] strong').html(all_evaluacion);
			if(all_evaluacion==0){jQuery('#selectores-filtros a[data-filter-type=centre]').addClass('bloqueado');}

			//Miramos si no hay libros
			if(all_demos==0 && all_evaluacion==0 ){
				jQuery('.empty-catalogo').show();
			}

			//Desbloqueamos filtros
			block_filter=0;
			//Activamos Lazyload para las imágenes
			jQuery("img.lazy:visible").lazyload({
				threshold : 1,
				load : function()
				{
					//Miramos span de Sample
					if(jQuery(this).parent().find('span').length>0){
						var alto_img=jQuery(this).height();
						jQuery(this).parent().find('span').css({bottom:(-alto_img/2)+20}).show();
						jQuery(this).parent().find('span.featured').css({marginTop:Math.round(-alto_img/2)+13}).show();
						jQuery(this).parent().find('span.cover').css({marginTop:Math.round(-alto_img/2)+16}).show();
					}
					//Miramos cover check
					if(jQuery(this).parents('.single-box-book').hasClass('check')){
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13}).show();
					}else{
						var alto_img=jQuery(this).height();
						var ancho_img=jQuery(this).width();
						jQuery(this).parent().find('div.cover_check').css({height:alto_img+2,width:ancho_img+2,top:(-alto_img/2)+13});
					}
				}
			});
		}

	}

}

//Función para eliminar hash
function removeHash () {
	var scrollV, scrollH, loc = window.location;
	if ("pushState" in history)
		history.pushState("", document.title, loc.pathname + loc.search);
	else {
		// Prevent scrolling by storing the page's current scroll offset
		scrollV = document.body.scrollTop;
		scrollH = document.body.scrollLeft;

		loc.hash = "";

		// Restore the scroll offset, should be flicker free
		document.body.scrollTop = scrollV;
		document.body.scrollLeft = scrollH;
	}
}

//Función para mostrar las notificaciones
function showNotification(msg,time){
   var t_visible;
   if (time === undefined || time === null) {
	  t_visible=2000;
   }else{
	  t_visible=time;
   }
   jQuery('#box-notificacion').html(msg).stop().clearQueue().fadeIn(400,function(){
	  jQuery(this).delay(t_visible).fadeOut(400);
   });
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

function recaptchaCallback(response) {
	jQuery('div[data-validation-rule="recaptcha"]').data('is-verified', true);
}

var validateForm = {

	form: null,
	fields: [],
	errors: [],
	hasErrors: false,

	validate: function( event ) {

		this.form      = jQuery(event.target);
		this.errors    = [];
		this.hasErrors = false;
		jQuery('.error', this.form).removeClass('error');
		jQuery('.errores', this.form).html('');

		this.fields = jQuery('*[data-validation-rule]:visible:not([readonly])', this.form);
		this.fields.each( jQuery.proxy( this.checkField , this ) );

		if( this.hasErrors ) {
			this.errors.unshift( this.form.data('error-msg') );
			this.showErrors();
			return false;
		}

		return true;
	},

	checkField: function(i,e) {

		var elem   = jQuery(e);
		var params = elem.data('validation-rule').split('|');
		var rule   = params.shift();
		var error  = false;

		//console.log('RULE:',rule);

		if( 'email' == rule ) {error = ! this.ruleIsEmail(elem);}
		if( 'repeat' == rule ) {error = ! this.ruleRepeat(elem, params[0]);}
		if( 'checkbox' == rule ) {error = ! this.ruleCheckbox(elem);}
		if( 'recaptcha' == rule ) {error = ! this.ruleValidRecaptcha(elem);}
		if( 'not-empty' == rule ) {error = ! this.ruleValidNotEmpty(elem);}
		if( 'zip' == rule ) {error = ! this.ruleValidZip(elem);}
		if( 'select-option' == rule ) {error = ! this.ruleValidSelectOption(elem);}
		if( 'multi-checkbox' == rule ) {error = ! this.ruleMultiCheckbox(elem);}
		if( 'min' == rule ) {error = ! this.ruleMinimumChars(elem, parseInt(params[0]));}
		if( 'screenshot' == rule ) {error = ! this.ruleValidScreenshot(elem, params);}


		if( error ) {
			if(rule == 'select-option') {
				elem.parent().addClass('error');
			} else if (rule == 'multi-checkbox') {
				elem.find('input[type="checkbox"]').addClass('error');
			} else {
				elem.addClass('error');
			}

			this.hasErrors = true;

			if( elem.data('error-msg') ) {
				this.errors.push( elem.data('error-msg') );
			}
		}
	},

	showErrors: function() {

		var errorList = jQuery.map(
			this.errors,
			function( value, index ){
				return jQuery('<p>').text(value);
			}
		);

		jQuery('.errores', this.form).html('').append( errorList );
	},

	ruleIsEmail: function(e) {
		return validateEmail(e.val());
	},

	ruleRepeat: function(e, repeatSelector) {
		return e.val() === jQuery(repeatSelector, this.form).val();
	},

	ruleCheckbox: function(e) {
		return e.is(":checked");
	},

	ruleValidRecaptcha: function(e) {
		return e.data('is-verified');
	},

	ruleValidNotEmpty: function(e) {
		return e.val() != '';
	},

	ruleValidZip: function(e) {
		return e.val().length == 5;
	},

	ruleValidSelectOption: function(e) {
		return e.prop('selectedIndex') != 0;
	},

	ruleMultiCheckbox: function(e) {
		return e.find('input[type="checkbox"]:checked').length > 0;
	},

	ruleMinimumChars: function(e, minChars) {
		return e.val().length >= minChars;
	},

	ruleValidScreenshot: function(e, params) {
		if( e.val() == '' ) {
			return true;
		}

		var fileExtension = e.val().split('.').pop().toLowerCase();

		return (jQuery.inArray(fileExtension, ['jpg','jpeg','png','gif']) !== -1 );
	}

}