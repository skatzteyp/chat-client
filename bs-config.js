const fs = require('fs-extra');

module.exports = {
	"port": 4000,
	"files": [
		"public/**/*.{html,htm,css,js}",
    {
			match : [ "app/**/*.html" ],
			fn : function(e, file) {
        var filename = file.replace('app', '');
        return fs.copySync(file, './public' + filename);
			}
    }
	],
	"server": {
		"baseDir": "public",
		"routes": {
			"/node_modules": "node_modules",
			"/config": "."
		}
	},
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  }
}
