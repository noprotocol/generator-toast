"use strict";
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var CakePHP = require('../lib/cakephp');


var ToastGenerator = module.exports = function ToastGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // this.on('end', function () {
  //   this.installDependencies({ skipInstall: options['skip-install'] });
  // });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ToastGenerator, yeoman.generators.NamedBase);
ToastGenerator.prototype.askFor = function askFor() {
  var runGenerator = this.async();
  this.animateLogo(function () {
    runGenerator();
  }.bind(this));
// runGenerator
  // var prompts = [{
  //   name: 'someOption',
  //   message: 'Are you a NoProtocol engineer?',
  //   default: 'Y/n',
  //   warning: 'Yes: Enabling this will be totally awesome!'
  // }];

  // this.prompt(prompts, function (err, props) {
  //   if (err) {
  //     return this.emit('error', err);
  //   }

  //   this.someOption = (/y/i).test(props.someOption);

  //   runGenerator();
  // }.bind(this));
  // runGenerator();
};
ToastGenerator.prototype.cakephp = function () {
  var self = this;
  var cakephp = new CakePHP(this);
  cakephp.install().then(function () {
    self.log.write("   Removing empty folders ");
    cakephp.cleanup();
    self.log.write("\n   Writable folders ");
    cakephp.chmod();
    self.log('\n\n   Installation complete!'.green.bold);
    self.log('\n     CakePHP: ' + cakephp.getVersion().bold);
  });
};


ToastGenerator.prototype.composer = function () {
  // var toastPath = path.dirname(path.dirname(module.id));
  // console.log(toastPath);
};

ToastGenerator.prototype.animateLogo = function (cb) {
  if (!cb) {
    return;
  }
  this.log('\n');
  var count = 35;
  var no = '\r   NO'.bold;
  var protocol = 'PROTOCOL'.magenta.bold;
  var self = this;
  var animate = function () {
    self.log.write(no + (new Array(count).join(' ')) + protocol + ':// '.bold);
    count--;
    if (count === 0) {
      setTimeout(function () {
        self.log.write(no + protocol + ';// ');
        setTimeout(function () {
          self.log.write(no + protocol + ':// '.bold);
          setTimeout(function () {
            self.log.write('\n\n');
            cb();
          }, 200);
        }, 500);
      }, 250);
    } else {
      setTimeout(animate, 5 + (30 - (count * 2)));
    }
  };
  animate();
};

