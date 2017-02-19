jQuery(function(){
	var userOnline = Number(jQuery('span.user_online').attr('id'));
	var clicou = new Array();

	function in_array(valor, array){
		for (var i = 0; i < array.length; i++) {
			if(array[i] == valor){
				return true;
			}
		}
		return false;
	}

	// PEGA A POSIÇÂO DO SCROLL
	function PositionScroll(){
		var scrollLocation = new Array();
		jQuery.each(jQuery('.window'), function(index){
			var janelaId = jQuery(this).attr('id');
			var idsConversa = janelaId.split('_');
			var idConversa = Number(idsConversa[1]);
			
			scrollLocation.push(Number(jQuery('#janela_' + idConversa + ' .mensagens').scrollTop()));
			
			
		});

		return scrollLocation;
	}

	// LIDOS
	function lidos(){
		var position = PositionScroll();
		
		jQuery.each(jQuery('.window'), function(index){
			var janelaId = jQuery(this).attr('id');
			var idsConversa = janelaId.split('_');
			var idConversa = Number(idsConversa[1]);			

			jQuery(".mensagens ul").html('');
			retorna_historico(idConversa,Number(position[index]));
		});
	}

	// FUNÇÃO QUE CRIA JANELAS DE CONVERSAS
	function add_janela(id, nome, status){
		var janelas = Number(jQuery('#chats .window').length);
		var pixels = (270 + 5)*janelas;
		var style = 'float: none; position: absolute; bottom: 0; left: ' + pixels + 'px';

		var splitDados = id.split(':');
		var id_user = Number(splitDados[1]);

		var janela = '<div class="window" id="janela_' + id_user + '" style="' + style + '">';
		janela += '<div class="header_window"><a href="#" class="close">X</a> <span class="name">' + nome + '</span> <span id="' + id_user + '" class="' + status + '"></span></div>';
		janela += '<div class="body"><div class="mensagens"><ul></ul></div>';
		janela += '<div class="send_message" id="' +  id + '"><input type="text" name="mensagem" class="msg" id="' + id + '"></div></div></div>';

		jQuery('#chats').append(janela);
	}

	// RETORNA HISTORICO
	function retorna_historico(id_conversa, scroll){
		scroll = scroll || 0;
		jQuery.ajax({
			type: 'POST',
			url: 'sys/historico.php',
			data: {conversacom: id_conversa, online: userOnline},
			dataType: 'json',
			success: function(retorno){
				jQuery.each(retorno, function(i, msg){
					if(jQuery('#janela_' + msg.janela_de).length > 0){
						if(userOnline == msg.id_de){
							if (msg.lido == 1) {
								jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '" class="eu"><p data-lido="' + msg.lido + '">' + msg.mensagem + '<br><span>Visto</span></p></li>');	
							}else{
								jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '" class="eu"><p data-lido="' + msg.lido + '">' + msg.mensagem + '</p></li>');								
							}
							
						}else{
							jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '"><div class="imgSmall"><img src="fotos/' + msg.fotoUser + '" /></div><p data-lido="' + msg.lido + '">' + msg.mensagem + '</p></li>');
						}
					}
				});
				//[].reverse.call(jQuery('#janela_' + id_conversa + ' .mensagens li')).appendTo(jQuery('#janela_' + id_conversa + ' .mensagens ul'));
				if (scroll == 1) {
					jQuery('#janela_' + id_conversa + ' .mensagens').scrollTop(250);	
				}else{
					jQuery('#janela_' + id_conversa + ' .mensagens').scrollTop(scroll);	
				}				
			}
		});
	}

	// CHAMA AS JANELAS
	jQuery('body').on('click', '#users_online a', function(){
		var id = jQuery(this).attr('id');
		jQuery(this).removeClass('comecar');

		var status = jQuery(this).next().attr('class');
		var splitIds = id.split(':');
		var idJanela = Number(splitIds[1]);


		if(jQuery('#janela_' + idJanela).length == 0){
			var nome = jQuery(this).text();
			add_janela(id, nome, status);
				retorna_historico(idJanela,1);

		}else{
			jQuery(this).removeClass('comecar');
		} 
	});

	// MINIMIZAR JANELAS
	jQuery('body').on('click', '.header_window', function(){
		var next = jQuery(this).next();
		next.toggle(100);
	});

	// FECHAR JANELAS
	jQuery('body').on('click', '.close', function(){
		var parent = jQuery(this).parent().parent();
		var idParent = parent.attr('id');
		var splitParent = idParent.split('_');
		var idJanelaFechada = Number(splitParent[1]);

		// Contagem para arrastar janelas
		var contagem = Number(jQuery('.window').length) - 1;
		var indice = Number(jQuery('.close').index(this));
		var restamAfrente = contagem - indice;

		for (var i = 1; i <= restamAfrente; i++) {
			jQuery('.window:eq(' + (indice+i) + ')').animate({left:"-=275"}, 200);
		}
		parent.remove();
			jQuery('#users_online li#' + idJanelaFechada + ' a').addClass('comecar');
	});

	// ENVIAR MENSAGEM
	jQuery('body').on('keyup', '.msg', function(e){
		if (e.which == 13) {
			var texto = jQuery(this).val();
			var id = jQuery(this).attr('id');
			var split = id.split(':');
			var para = Number(split[1]);

			jQuery.ajax({
				type: 'POST',
				url: 'sys/submit.php',
				data: {mensagem: texto, de: userOnline, para: para},
				success: function(retorno){
					if (retorno == 'ok') {
						jQuery('.msg').val('');
					}else{
						alert("Ocorreu um erro ao enviar a mensagem");
					}
				}
			});
		}
	});

	// VERIFICA SE FOI LIDA
	jQuery('body').on('click', '.mensagens', function(){
		var janela = jQuery(this).parent().parent();
		var janelaId = janela.attr('id');
		var idConversa = janelaId.split('_');
		idConversa = Number(idConversa[1]);

		jQuery.ajax({
			url: 'sys/ler.php',
			type: 'POST',
			data: {ler : 'sim', online: userOnline, user: idConversa},
			success: function(retorno){
				/*jQuery(".mensagens ul").html('');	
				retorna_historico(idConversa);*/
				lidos();
			}
		});
	});

	// UPDATE DO CHAT
	function verifica(timestamp, lastid, user){
		var t;
		jQuery.ajax({
			url: 'sys/stream.php',
			type: 'GET',
			data: 'timestamp=' + timestamp + '&lastid=' + lastid + '&user=' + user,
			dataType: 'json',
			success: function(retorno){
				clearInterval(t);
				
				if (retorno.status == 'resultados' || retorno.status == 'vazio') {	
					t = setTimeout(function(){
						verifica(retorno.timestamp, retorno.lastid, userOnline);
					}, 1000);

					// VERIFICA AS MENSAGENS
					if (retorno.status == 'resultados') {
						jQuery.each(retorno.dados, function(i, msg){
							if(msg.id_para == userOnline){
								jQuery.playSound('sys/effect');
							}

							if (jQuery('#janela_' + msg.janela_de).length == 0 && msg.id_para == userOnline) {
								jQuery('#users_online #' + msg.janela_de + ' .comecar').click();
								clicou.push(msg.janela_de);
							}

							if (!in_array(msg.janela_de, clicou)) {
								if (jQuery('.mensagens ul li#' + msg.id).length == 0 && msg.janela_de > 0) {
									if (userOnline == msg.id_de) {
										if (msg.lido == 1) {
											jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '" class="eu"><p data-lido="' + msg.lido + '">' + msg.mensagem + '<br><span>Visto</span></p></li>');	
										}else{
											jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '" class="eu"><p data-lido="' + msg.lido + '">' + msg.mensagem + '</p></li>');								
										}
									}else{
										jQuery('#janela_' + msg.janela_de + ' .mensagens ul').append('<li id="' + msg.id + '"><div class="imgSmall"><img src="fotos/' + msg.fotoUser + '" /></div><p data-lido="' + msg.lido + '">' + msg.mensagem + '</p></li>');
									}
								}
							}
						});
						jQuery('.mensagens').animate({scrollTop: 250}, '500');
						console.log(clicou);
					}else if(retorno.status == 'vazio'){
						/*jQuery('.mensagens ul').html('');

						var janela = jQuery('.mensagens').parent().parent();
						var janelaId = janela.attr('id');
						var idConversa = janelaId.split('_');
						idConversa = Number(idConversa[1]);


						retorna_historico(idConversa);*/
						//lidos();
					}
					clicou = [];

					// VERIFICA USUARIOS
					jQuery('#users_online ul').html('');
					jQuery.each(retorno.users, function(i, user){
						var incluir = '<li id="' + user.id + '"><div class="imgSmall"><img src="fotos/' + user.foto + '" border="0"/></div>';
						incluir += '<a href="#" id="' + userOnline + ':' +  user.id+ '" class="comecar">' + user.nome + '</a>';
						incluir += '<span id="' + user.id + '" class="status ' + user.status + '"></span></li>';
						jQuery('span#' + user.id).attr('class', 'status ' + user.status);
						jQuery('#users_online ul').append(incluir);
					});

				}else if(retorno.status == 'erro'){
					alert('Ficamos confusos, atualize a pagina');
				}
			},
			error: function(retorno){
				clearInterval(t);
				t = setTimeout(function(){
					verifica(retorno.timestamp, retorno.lastid, userOnline);	
				}, 15000);
			}
		});
	}

	verifica(0,0,userOnline);
});