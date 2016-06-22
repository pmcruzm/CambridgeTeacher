/**********************
FUNCIONES JQUERY (MOCKUP)
Autor:Pedro de la Cruz
Fecha: 15-6-2016
Cliente: Cambridge Teacher
***********************/


jQuery.noConflict();

jQuery(document).ready(function(){
	
	//Asignamos nº de slicks item a la variables 
	s_slicks=jQuery('.slick-slide').length;

	//Hacer click en los iconos de añadir o eliminar
	jQuery(document).on('click','.plus-book',function(e){
		e.preventDefault();
		var txt='<p>Quickminds 3 ha sido añadido a tu colección</p>';
		var time=1000;
		showNotification(txt,time);
	});
	
	jQuery(document).on('click','.minus-book',function(e){
		e.preventDefault();
		 var index_p=jQuery(this).parent('.slick-slide').index();
		  jQuery('.carrusel-list').slick('slickRemove',index_p);
		  if (s_slicks!= 1){ 
			//Quitamos de la varible que tiene el nº de slides
			s_slicks--;
		  }else{
			 jQuery('.carrusel-list').hide(); 
			 jQuery('.empty-titles').fadeIn(400);
			//alert('Carrusel vacío');
		  }
	});

});