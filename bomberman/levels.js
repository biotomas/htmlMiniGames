/**
 * 
 */
const gridSize = 60;

const items = {
		WALL:"#",
		PLAYER:"@",
		BOX:"$",
		COIN:".",
		FLOOR:" ",
		ENEMY:"E",
};

var levelId = 0;


var levels = [`\
###
#.#
# #
# #
# #
# #
#@#
###
`,`\
###
#.#
#$#
# #
# #
# #
#@#
###
`,`\
######
#   .#
# E ##
#   #
#   #
#   #
# @ #
#####
`];
