CREATE TABLE `gameMoves` (
  `gameId` int(11) NOT NULL,
  `move` varchar(50) NOT NULL,
  `step` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=big5;

CREATE TABLE `lobby` (
  `gameId` int(11) NOT NULL,
  `mapId` int(11) DEFAULT NULL,
  `players` int(11) DEFAULT NULL,
  `name0` varchar(45) DEFAULT NULL,
  `name1` varchar(45) DEFAULT NULL,
  `name2` varchar(45) DEFAULT NULL,
  `name3` varchar(45) DEFAULT NULL,
  `name4` varchar(45) DEFAULT NULL,
  `name5` varchar(45) DEFAULT NULL,
  `name6` varchar(45) DEFAULT NULL,
  `name7` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`gameId`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
