-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Tempo de geração: 19/02/2017 às 12:12
-- Versão do servidor: 10.0.29-MariaDB-0ubuntu0.16.04.1
-- Versão do PHP: 7.0.13-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `chatPrototype`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagens`
--

CREATE TABLE `mensagens` (
  `id` int(11) NOT NULL,
  `id_de` int(11) NOT NULL,
  `id_para` int(11) NOT NULL,
  `mensagem` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `lido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Fazendo dump de dados para tabela `mensagens`
--

INSERT INTO `mensagens` (`id`, `id_de`, `id_para`, `mensagem`, `time`, `lido`) VALUES
(1, 2, 1, 'teste1', 1487265854, 1),
(2, 1, 2, 'teste2', 1487265863, 1),
(3, 1, 3, 'teste3', 1487265878, 1),
(4, 3, 1, 'ola', 1487265981, 1),
(5, 1, 3, 'teste5', 1487265991, 1),
(6, 1, 2, 'teste5', 1487265997, 1),
(7, 2, 1, 'hey', 1487266011, 1),
(8, 2, 1, 't', 1487266012, 1),
(9, 2, 1, 't', 1487266015, 1),
(10, 2, 1, 't', 1487266015, 1),
(11, 1, 2, 'erro?', 1487266060, 1),
(12, 1, 2, 'erro2?', 1487266148, 1),
(13, 2, 1, 'nah', 1487266166, 1),
(14, 1, 3, 't', 1487268544, 0),
(15, 1, 3, 't', 1487268546, 0),
(16, 1, 3, 't', 1487268547, 0),
(17, 1, 3, 't', 1487268548, 0),
(18, 2, 4, 's', 1487271809, 0),
(19, 2, 4, 's', 1487271810, 0),
(20, 2, 4, 's', 1487271811, 0),
(21, 2, 4, 's', 1487271811, 0),
(22, 2, 4, 's', 1487271812, 0),
(23, 2, 4, 's', 1487271812, 0),
(24, 2, 4, 's', 1487271814, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `foto` varchar(200) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `horario` datetime NOT NULL,
  `limite` datetime NOT NULL,
  `blocks` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Fazendo dump de dados para tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `foto`, `nome`, `email`, `horario`, `limite`, `blocks`) VALUES
(1, 'lucas.jpg', 'Lucas Silva', 'lucas.designer@gmail.com', '2017-02-19 11:08:48', '2017-02-19 12:13:33', ''),
(2, '', 'Leonardo Bevilacqua', 'leonardo_bevilacqua@hotmail.com', '2017-02-16 17:01:09', '2017-02-16 17:04:35', ''),
(3, '', 'Maria', 'Maria', '2017-02-16 15:26:17', '2017-02-16 15:27:38', ''),
(4, '', 'Luiz', 'Luiz', '2017-02-16 13:41:19', '2017-02-16 16:20:31', '');

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
