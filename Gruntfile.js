"use strict";

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    var appConfig = {
      dist: "dist",
      static : "./static/",
      platformDeployment:"/var/www/widget/",
      nginx: "conf/nginx"
    };

    grunt.initConfig({
      app : appConfig,

      clean: {
          dist: {
              files: [{
                  dot: true,
                  src: [
                      ".tmp",
                      "<%= app.dist %>/{,*/}*"
                  ]
              }]
          }
      },

      uglify: {
            options: {
                report: "min",
                mangle: false
            },
            widget: {
                files: {
                    "<%= app.dist %>/widget.min.js": ["<%= app.static %>/widget.js"],
                    "<%= app.dist %>/callmanager.min.js": ["<%= app.static %>/callmanager.js"]
                }
            }
        },

        copy: {
          static:{
                expand: true,
                cwd: "<%= app.static %>",
                src: ["**/*.*"],
                dest: "<%= app.dist %>"
            },
            staticHTML:{
                  expand: true,
                  cwd: "<%= app.static %>",
                  src: ["**/*.html"],
                  dest: "<%= app.dist %>"
            },
            deployPlatform: {
              expand : true,
              cwd : "<%= app.dist%>",
              src : ["**/*.*"],
              dest: "<%= app.platformDeployment %>"
            },
            nginx: {
              expand: true,
              cwd: appConfig.nginx,
              src:  ["**/*.conf"],
              dest: "/etc/nginx/conf.d/"
            }
        },

        replace: {
            widgetDevResourcesHost: {
              src: ["<%= app.dist %>/**/*.*"],
              overwrite: true,                 // overwrite matched source files
              replacements: [{
                from: "https://platform.ubicall.com/widget/callmanager.min.js",
                to: "https://platform.ubicall.com/widget/callmanager.js"
              },{
                from: "https://platform.ubicall.com/widget/",
                to: "https://platform-dev.ubicall.com/widget/"
              },{
                from: "https://cdn.ubicall.com/static/",
                to: "https://cdn-dev.ubicall.com/static/"
              },{
                from: "https://api.ubicall.com",
                to: "https://api-dev.ubicall.com"
              }]
            }
          }
      });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-nginx");

    grunt.registerTask("preserve", "Clean then build to dist as a development", [
        "clean",
        "copy:static",
        "replace:widgetDevResourcesHost",
        "copy:deployPlatform",
        "copy:nginx",
        "nginx:restart"
    ]);

    grunt.registerTask("prebuild", "Clean then build to dist", [
        "clean",
        "copy:staticHTML",
        "uglify:widget",
        "copy:deployPlatform",
        "copy:nginx",
        "nginx:restart"
    ]);

    grunt.registerTask("default", [
      "prebuild"
  ]);
};
