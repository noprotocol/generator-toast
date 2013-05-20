/**
 *
 */

 "use strict";
var q = require('q');
var fs = require('fs');
var path = require('path');


var CakePHP = module.exports = function CakePHP(generator) {
	this.generator = generator;
	CakePHP.util.log = generator.log;
};

CakePHP.prototype = {

	install: function () {
		var defer = q.defer();
		var url = 'https://github.com/cakephp/cakephp/archive/master.tar.gz';
		this.generator.tarball(url, this.generator.destinationRoot(), function	(err) {
			if (err) {
				defer.reject(err);
			}
			defer.resolve();
		});
		return defer.promise;
	},

	cleanup: function () {
		CakePHP.util.removeEmptyEmptyFiles(this.getPath('app'));
		CakePHP.util.removeEmptyFolders(this.getPath('app'));
	},

	chmod: function () {
		CakePHP.util.createWritableFolder(this.getPath('app/tmp/'));
		CakePHP.util.createWritableFolder(this.getPath('app/tmp/cache'));
		CakePHP.util.createWritableFolder(this.getPath('app/tmp/cache/persistent'));
		CakePHP.util.createWritableFolder(this.getPath('app/tmp/cache/models'));
		CakePHP.util.createWritableFolder(this.getPath('app/webroot/uploads'));
	},

	getVersion: function () {
		var contents = fs.readFileSync(this.getPath('lib/Cake/VERSION.txt'), { encoding: 'utf8' });
		var matches = contents.match(/\n([0-9.]+)/);
		return matches[1];
	},
	getPath: function(filePath) {
		return path.join(this.generator.destinationRoot(), filePath);
	}

};

CakePHP.util = {

	/**
	 * Remove cakephp's "empty" files.
	 * @sync
	 * @param	{string} dir
	 */
	removeEmptyEmptyFiles: function (dir) {
		fs.readdirSync(dir).forEach(function (file) {
			var filepath = path.join(dir, file);
			var stat = fs.statSync(filepath);
			if (stat.isDirectory()) {
				CakePHP.util.removeEmptyEmptyFiles(filepath);
			} else if (file === 'empty' && stat.size === 0) {
				CakePHP.util.log.write('.');
				fs.unlinkSync(filepath);
			}
		});
	},

	/**
	 * Remove empty folders
	 * @sync
	 */
	removeEmptyFolders: function (dir) {
		var stat = fs.statSync(dir);
		if (stat.isDirectory() === false) {
			return false;
		}
		var removedCount = 0;
		var files = fs.readdirSync(dir);
		files.forEach(function (file) {
			if (CakePHP.util.removeEmptyFolders(path.join(dir, file))) {
				removedCount++;
			}
		});
		if (files.length - removedCount === 0) {
			CakePHP.util.log.write('.');
			fs.rmdirSync(dir);
			return true;
		}
		return false;
	},

	/**
	 * Make tmp/ writable
	 */
	createWritableFolder: function (dir) {
		if (fs.existsSync(dir) === false) {
			fs.mkdirSync(dir);
		}
		var rwxrwxrwx =	parseInt("777", 8);
		fs.chmodSync(dir, rwxrwxrwx);
		CakePHP.util.log.write('.');
	}
};