'use strict';
var path = require('path');
var npmName = require('npm-name');
var yeoman = require('yeoman-generator');
var color = require('colors');
var gitScopeConfig = require('git-scope-config')({
  scope: "global"
});
var gitHubInit = require('github-init');


module.exports = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');

    var bode = "\n\n" +
      "                                                 dddddddd\n".yellow +
      "BBBBBBBBBBBBBBBBB                                d::::::d\n".yellow +
      "B::::::::::::::::B                               d::::::d\n".yellow +
      "B::::::BBBBBB:::::B                              d::::::d\n".yellow +
      "BB:::::B     B:::::B                             d:::::d\n".green +
      "  B::::B     B:::::B   ooooooooooo       ddddddddd:::::d     eeeeeeeeeeee\n".green +
      "  B::::B     B:::::B oo:::::::::::oo   dd::::::::::::::d   ee::::::::::::ee\n".green +
      "  B::::BBBBBB:::::B o:::::::::::::::o d::::::::::::::::d  e::::::eeeee:::::ee\n".green +
      "  B:::::::::::::BB  o:::::ooooo:::::od:::::::ddddd:::::d e::::::e     e:::::e\n" +
      "  B::::BBBBBB:::::B o::::o     o::::od::::::d    d:::::d e:::::::eeeee::::::e\n".blue +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::::::::::::e\n".blue +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e::::::eeeeeeeeeee\n".blue +
      "  B::::B     B:::::Bo::::o     o::::od:::::d     d:::::d e:::::::e\n".blue +
      "BB:::::BBBBBB::::::Bo:::::ooooo:::::od::::::ddddd::::::dde::::::::e\n".red +
      "B:::::::::::::::::B o:::::::::::::::o d:::::::::::::::::d e::::::::eeeeeeee\n".red +
      "B::::::::::::::::B   oo:::::::::::oo   d:::::::::ddd::::d  ee:::::::::::::e\n".red +
      "BBBBBBBBBBBBBBBBB      ooooooooooo      ddddddddd   ddddd    eeeeeeeeeeeeee\n".red;

    this.log(bode +
      '\nThe name of your project shouldn\'t contain "node" or "js" and'.cyan +
      '\nshould be a unique ID not already in use at npmjs.org.'.cyan);
  },
  askForModuleName: function() {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Module Name'.green,
      default: path.basename(process.cwd()),
    }, {
      type: 'confirm',
      name: 'pkgName',
      message: 'npm package already exist, please choose another name'.green,
      default: true,
      when: function(answers) {
        var done = this.async();
        npmName(answers.name, function(err, available) {
          if (!available) {
            done(true);
            return;
          }
          done(false);
        });
      }
    }];

    this.prompt(prompts, function(props) {
      if (props.pkgName) {
        return this.askForModuleName();
      }

      this.slugname = this._.slugify(props.name);
      this.safeSlugname = this.slugname.replace(/-+([a-zA-Z0-9])/g, function(g) {
        return g[1].toUpperCase();
      });
      done();
    }.bind(this));
  },

  askForGithubProcess: function() {
    var done = this.async();
    var githubToken;

    var prompt = [{
      type: 'confirm',
      name: 'git',
      message: "create github repo with module name?".green,
      default: true,
    }, {
      when: function(response) {
        var done = this.async();
        if (response.git) {
          gitScopeConfig.get('github.token', function(err, token) {
            if (err) {
              done(true);
              return;
            }
            if (token) {
              githubToken = token;
              done(false);
              return;
            }
          });
        } else {
          done(false);
          return;
        }
      },
      type: 'message',
      name: 'token',
      message: "Github token not found, create new from here".red + " https://github.com/settings/applications".blue
    }]

    this.prompt(prompt, function(props) {
      var _this = this;
      if (props.token) {
        gitScopeConfig.set('github.token', props.token, function(err, status) {
          if (err) {
            done();
            return;
          }
          _this.githubToken = props.token;
          done();
        })
      } else {
        this.githubToken = githubToken;
        done();
      }
    }.bind(this));
  },

  askFor: function() {
    var cb = this.async();

    var prompts = [{
      name: 'version',
      message: 'version(0.0.0)'.green,
      default: '0.0.1'
    }, {
      name: 'description',
      message: 'Description'.green,
      default: 'This is awesome application'
    }, {
      name: 'homepage',
      message: 'Homepage'.green
    }, {
      name: 'license',
      message: 'License'.green,
      default: 'MIT'
    }, {
      name: 'githubUsername',
      message: 'GitHub username'.green,
      store: true
    }, {
      name: 'authorName',
      message: 'Author\'s Name'.green,
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email'.green,
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage'.green,
      store: true
    }, {
      type: 'confirm',
      name: 'cli',
      message: 'Lets run it from CLI'.green
    }];

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function(props) {
      if (props.githubUsername) {
        this.githubUsername = props.githubUsername;
        this.repoUrl = props.githubUsername + '/' + this.slugname;
      } else {
        this.repoUrl = 'user/repo';
      }

      this.keywords = props.keywords.split(',').map(function(el) {
        return el.trim();
      });

      this.props = props;

      cb();
    }.bind(this));
  },

  app: function() {
    this.config.save();
    this.copy('editorconfig', '.editorconfig');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('travis.yml', '.travis.yml');
    this.copy('.npmignore', '.npmignore');

    this.template('jshintrc', '.jshintrc');

    this.template('README.md', 'README.md');

    this.template('_package.json', 'package.json');

    if (this.props.cli) {
      this.template('cli.js', 'cli.js');
    }
    var license = this.props.license.trim().toUpperCase();
    if (license === 'MIT') {
      this.template('MIT_LICENSE', 'LICENSE');
    }
  },

  projectfiles: function() {
    this.template('index.js', 'index.js');
    this.template('test.js', 'test.js');
  },

  install: function() {
    var self = this;
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install'],
      callback: function(err) {
        gitHubInit({
          username: self.githubUsername,
          token: self.githubToken,
          reponame: self.slugname,
          callback: function(err, data) {
            if (err) {
              self.log(err);
              return;
            }
            self.log(data);
          }
        })
      }
    });
  }
});
