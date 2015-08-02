'use strict';
var settings = require('./settings');


module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var appConfig = {
      dist: 'dist',
      static : './static/'
    };

    grunt.initConfig({
      app : appConfig,

      clean: {
          dist: {
              files: [{
                  dot: true,
                  src: [
                      '.tmp',
                      '<%= app.dist %>/{,*/}*'
                  ]
              }]
          }
      },

      uglify: {
            options: {
                report: 'min',
                mangle: false
            },
            widget: {
                files: {
                    '<%= app.dist %>/widget/widget.min.js': ['static/widget/widget.js'],
                    '<%= app.dist %>/widget/callmanager.min.js': ['static/widget/callmanager.js'],
                }
            }
        },

        copy: {
          static:{
                expand: true,
                cwd: '<%= app.static %>',
                src: ['**/widget/*.*'],
                dest: '<%= app.dist %>/widget/'
            },
            deployPlatform: {
              expand : true,
              cwd : '<%= app.dist%>/widget',
              src : ['**/*.*'],
              dest: settings.cdn.widget
            }
        }
      });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('prebuild', 'Clean then build to dist', [
        'clean',
        'uglify:widget',
        'copy:static',
        'copy:deployPlatform',
    ]);

    grunt.registerTask('default', [
      'prebuild'
  ]);
};
