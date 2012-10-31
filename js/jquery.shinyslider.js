/*
*	GALERY
*	plugin permettant de ger les galeries photo en front
*/


(function($){

	// initlasation des variables
	var $obj;
	var $item;
	var $view;
	var $nbitem = 0;
	var $current = 0;
	var $timer;
	
	
	
	$.fn.shinyslider = function(options){
	
	
		// initialisation des options
		var $settings = {
			width_item 	: 100,
			nbitem_page : 5,
			view 		: 'inline',
			auto		: false,
			timer		: 3000
		};
		
		
		
		
		// function principale
		
		return this.each(function(){
		
		
			// concaténation des option de base et d'user
			$settings = $.extend($settings,options);
			
			$obj= $(this);
			
			if($settings['view'] == 'diaporama'){
				$item = $('img',$obj);
			}else{
				$item = $('a',$obj);
			}
			
			$nbitem = $item.length;
			
			if($nbitem > 0){
				init();
			}
			
		});	
		
		
		
		
		// initlisation de l'élément
		function init(){
			
			$obj.addClass('shinyslider');
			
			switch($settings['view']){

				case 'diaporama':
					
					$item.hide();
					$item.eq($current).show();
					$obj.addClass('shinyslider shinyslider_diaporama');
					
					// création des control
					if($nbitem > 1){
						control();
					}
					
					// initialisation du timer
					setTimer();
					
				break;
				
				
				case 'inline':
				case 'box':
				
					$obj.addClass('shinyslider shinyslider_inline');
				
					if($settings['view'] == 'inline'){
						$obj.prepend('<div class="shinyslider_view"></a>');
						$view = $('.shinyslider_view',$obj);
					
						$view.append('<div class="shinyslider_loader"><img src="' + helper.getBaseUrl() + 'static/img/icon/loader.gif" /></div>');
						$loader = $('.shinyslider_loader',$view);
					}
					
					$item.wrapAll('<div class="shinyslider_item"><div class="shinyslider_item_view"></div></div>');
					$item_box = $('.shinyslider_item',$obj);
					$item_view = $('.shinyslider_item_view',$item_box);
					$item_view.css({ width : ($nbitem * $settings['width_item']) });
					
					// ajout du bouton zoom sur chaque éléments
					$item.append('<span class="zoom"></span>');
					
					// création des control
					if($nbitem > $settings['nbitem_page']){
						control();
					}
					
					if($nbitem <= 1){
						$item_box.hide();
					}
					
					// initalisation des avtion sur les item
					view();
				
				break;
				
				
			}

		}
		
		
		
		
		
		// création des controls pour les items
		function control(){
			
			switch($settings['view']){

				case 'diaporama':
					$obj.append('<div class="shinyslider_control_diaporama"></div>');
					for(var i=1; i<=$nbitem; i++){
						$obj.find('.shinyslider_control_diaporama').append('<a>'+ i +'</a>');
					}
					
					$obj.find('.shinyslider_control_diaporama a').eq($current).addClass('active');
					
					$obj.find('.shinyslider_control_diaporama a').click(function(){
						$current = $obj.find('.shinyslider_control_diaporama a').index($(this));
						clearInterval($timer);
						setTimer();
						view();
					});
					
				break;
				
				
				case 'inline':
				case 'box':
				
					$item_box.append('<a class="shinyslider_control previous"><span>Précédent</span></a><a class="shinyslider_control next"><span>Suivant</span></a>');
		
					$item_box.find('.shinyslider_control').click(function(){
						
						if($(this).hasClass('previous')){
							setCurrent(0);
						}else if($(this).hasClass('next')){
							setCurrent(1);
						}
						
					});
				
				break;
				
				
			}
			
		}
		
		
		
		// génération du current
		function setCurrent(sens){
		
			switch($settings['view']){
				
				case 'diaporama':
				
					if($current < $nbitem - 1){
						$current++;
					}else{
						$current = 0;
					}
					
					view();
					
				break;
				
				case 'inline':
				case 'box':
				
					if(sens){
						if($current < $nbitem - 1 && ($nbitem - 1) - $current >= $settings['nbitem_page']){
							$current++;
						}else{
							$current = 0;
						}
					}else{
						if($current > 0){
							$current--;
						}else{
							$current = $nbitem - $settings['nbitem_page'];
						}
					}
					
					moveItem();
					
				break;
				
			}
			
		}
		
		
		// anime la liste des items
		function moveItem(){
			$item_view.animate({ left : -( $settings['width_item'] * $current) });
		}
		
		
		
		
		// action sur les item
		function view(){
		
			
			switch($settings['view']){
				
				
				
				case 'diaporama':
					$item.fadeOut();
					$item.eq($current).fadeIn();
					
					$obj.find('.shinyslider_control_diaporama a').removeClass('active')
																 .eq($current).addClass('active');
					
				break;
				
				
				
				// présentation inline
				case 'inline':
				
					// affichage de la première image
					var src = $item.eq(0).attr('href');
					var img = new Image();
					img.src = src;
					var interval = setInterval(function(){
						if(loadImage(img)){
							clearInterval(interval);
							$view.prepend('<img src="' + src + '" class="shinyslider_img"/>');
							setTimeout(function(){
								$loader.fadeOut();
							},500);
						}
					}, 100);
					
					
					// change d'image
					$item.click(function(){
				
						$loader.fadeIn();
						
						src = $(this).attr('href');
						var img = new Image();
						img.src = src;
						var interval = setInterval(function(){
							if(loadImage(img)){
								clearInterval(interval);
								$view.find('.shinyslider_img').attr('src',src);
								setTimeout(function(){
									$loader.fadeOut();
								},500);
							}
						}, 100);
						
						return false;
						
					});
					
				break;
				
				
				
				// présentation en BOX
				case 'box':
					$item.fancybox({
						overlayOpacity : 1,
						overlayColor : 'transparent'
					});	
				break;
				
			}
		
			
			
			
		}
		
		
		// permet de détecter le chargement d'une image
		function loadImage(img){
		
			if(img.complete){
				return true;
			}else{
				return false;
			}
			
		}
		
		
		
		
		// inistilaistion du timer pour un défilement automatique
		function setTimer(){
			$timer = setInterval(function(){
				setCurrent();
			}, $settings['timer']);
		}





	};
	
	
	
	
})(jQuery);