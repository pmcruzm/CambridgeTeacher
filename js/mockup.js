/**********************
FUNCIONES JQUERY (MOCKUP)
Autor:Pedro de la Cruz
Fecha: 15-6-2016
Cliente: Cambridge Teacher
***********************/


jQuery.noConflict();

jQuery(document).ready(function(){

	//Hacer click en los iconos de añadir o eliminar
	jQuery(document).on('click','.plus-book,.minus-book',function(e){
		e.preventDefault();
		var txt='<p>Quickminds 3 ha sido añadido a tu colección</p>';
		var time=1000;
		showNotification(txt,time);
	});

});