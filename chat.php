<?php
	session_start();
	include_once "defines.php";
	require_once('classes/BD.class.php');
	BD::conn();

	if (!isset($_SESSION['email_logado'], $_SESSION['id_user']) ) {
		header("Location: index.php");
	}

	$pegaUser = BD::conn()->prepare("SELECT * FROM usuarios WHERE email = ?");
	$pegaUser->execute(array($_SESSION['email_logado']));
	$dadosUser = $pegaUser->fetch();

	if (isset($_GET['acao']) && $_GET['acao'] == 'sair') {
		unset($_SESSION['email_logado']);
		unset($_SESSION['id_user']);
		session_destroy();
		header("Location: index.php");
	}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset=UTF-8>
	<title>Prototype Chat Application</title>
	<link rel="stylesheet" href="css/style.css" type="text/css">
	<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="js/jquery_play.js"></script>
	<script type="text/javascript">$.noConflict();</script>
</head>
<body>
<span class="user_online" id="<?php echo $dadosUser['id']; ?>"></span><br>
<h2>Bem vindo, <?php echo utf8_encode($dadosUser['nome']); ?> <a href="?acao=sair">Sair</a></h2>

<?php 
	if (isset($_POST['acao']) && $_POST['acao'] == 'block') {
		$bloquear = $_POST['bloquear'];
		if($dadosUser['blocks'] == ''){
			$bloquear = implode(',', $bloquear);
		}else{
			$bloquearMais = implode(', ', $bloquear);
			$bloquear = $dadosUser['blocks'] . ', ' . $bloquearMais;
		}

		$updateBloqueados = BD::conn()->prepare("UPDATE usuarios SET blocks = ? WHERE id = ?");
		if ($updateBloqueados->execute(array($bloquear, $_SESSION['id_user']))) {
			echo " Usuarios bloqueados";
		}
	}

	if (isset($_POST['acao']) && $_POST['acao'] == 'desblock'){
		$bloqueadosArray = explode(',', $dadosUser['blocks']);
		$queroDesbloquear = $_POST['desbloquear'];
		foreach ($queroDesbloquear as $indice => $val) {
			if (in_array($val, $bloqueadosArray)) {
				$indiceTirar = array_search($val, $bloqueadosArray);
				unset($bloqueadosArray[$indiceTirar]);
			}
		}
		$bloqueadosNovos = implode(',', $bloqueadosArray);

		$updateBloqueados = BD::conn()->prepare("UPDATE usuarios SET blocks = ? WHERE id = ?");
		if ($updateBloqueados->execute(array($bloqueadosNovos, $_SESSION['id_user']))) {
			echo " Usuarios desbloqueados";
		}
	}
?>

<form action="" method="post" enctype="multipart/form-data" style="float: left; width: 500px">

	<?php 
		$bloqueados = $dadosUser['blocks'];
		$pegaBloqueados = BD::conn()->prepare("SELECT * FROM usuarios WHERE id IN($bloqueados)");
		$pegaBloqueados->execute();
		while ($bloqueado = $pegaBloqueados->fetch()) {
			echo '<input type="checkbox" name="desbloquear[]" value="' . $bloqueado['id'] . '" />' . utf8_encode($bloqueado['nome']) . '<br>';
		}
	?>

	<input type="hidden" name="acao" value="desblock">
	<input type="submit" value="desbloquear">
</form>

<form action="" method="post" enctype="multipart/form-data" style="float: left; ">

	<?php 
		$arrayBloqueados = explode(',', $bloqueados);
		$pegaDesbloqueados = BD::conn()->prepare("SELECT * FROM usuarios WHERE id != ?");
		$pegaDesbloqueados->execute(array($_SESSION['id_user']));
		while ($desbloqueado = $pegaDesbloqueados->fetch()) {
			if(!in_array($desbloqueado['id'], $arrayBloqueados)){
				echo '<input type="checkbox" name="bloquear[]" value="' . $desbloqueado['id'] . '" />' . utf8_encode($desbloqueado['nome']) . '<br>';
			}
		}
	?>

	<input type="hidden" name="acao" value="block">
	<input type="submit" value="Bloquear">
</form>

	<!-- Tela de usuarios -->
	<aside id="users_online">
		<ul>
			<?php 
				$pegaUsuarios = BD::conn()->prepare("SELECT * FROM usuarios WHERE id != ? ORDER BY id DESC");
				$pegaUsuarios->execute(array($_SESSION['id_user']));
				while ($row = $pegaUsuarios->fetch()) {

					$foto = ($row['foto'] == '') ? 'default.jpg' : $row['foto'];
					$blocks = explode(',', $row['blocks']);
					$agora = date('Y-m-d H:i:s');

					if (!in_array($_SESSION['id_user'], $blocks)) {
						$status = 'on';
						if ($agora >= $row['limite']) {
							$status = 'off';
						}
			?>
			<li id="<?php echo $row['id']; ?>">
				<div class="imgSmall"><img src="fotos/<?php echo $foto; ?>" alt="lucas.jpg" border="0"></div>
				<a href="#" id="<?php echo $_SESSION['id_user'] . ':' . $row['id']; ?>" class="comecar"><?php echo utf8_encode($row['nome']); ?></a>
				<span id="<?php echo $row['id']; ?>" class="status <?php echo $status; ?>"></span>
			</li>
			<?php }} ?>
		</ul>
	</aside>

	<!-- Tela de mensagem -->
	<aside id="chats">
		
	</aside>
	<script type="text/javascript" src="js/functions.js"></script>
</body>
</html>

<!--div class="window" id="janela_x">
	<div class="header_window"><a href="#" class="close">X</a> <span class="name">Fulando de Tal</span> <span id="5" class="status on"></span></div>
	<div class="body">
		<div class="mensagens">
			<ul>
				
			</ul>
		</div>
		<div class="send_message" id="3:5">
			<input type="text" name="mensagem" class="msg" id="3:5">
		</div>
	</div>
</div-->