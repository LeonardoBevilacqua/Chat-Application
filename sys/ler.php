<?php
	if (isset($_POST['ler'])) {
		include_once "../defines.php";
		require_once('../classes/BD.class.php');
		BD::conn();

		$online = (int)$_POST['online'];
		$user = (int)$_POST['user'];

		$upd = BD::conn()->prepare("UPDATE mensagens SET lido = 1 WHERE id_de = ? AND id_para = ?");
		if ($upd->execute(array($user, $online))) {
			echo $online;
		}
	}

	if(isset($_POST['lido'])){
		include_once "../defines.php";
		require_once ('../classes/BD.class.php');
		BD::conn();

		$online = (int)$_POST['online'];
		$user = (int)$_POST['user'];

		$verificaLido = BD::conn()->prepare("SELECT * FROM mensagens WHERE id_de = ? AND id_para = ? ORDER BY id DESC LIMIT 1");
		if ($verificaLido->execute(array($online, $user))) {
			$row = $verificaLido->fetch();

			echo $row['lido'];
		}
	}
?>