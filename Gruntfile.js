var path;

path = require('path');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    var srcPath = path.normalize(grunt.option('srcBase') || 'Lumy.Website'),
        modifyFileRevSummary = function (summary) {
            var changedKey, changedValue, key, parts, res, value;
            res = {};
            for (key in summary) {
                if (summary.hasOwnProperty(key)) {
                    value = summary[key];
                    parts = key.split('\\');
                    changedKey = parts[parts.length - 2] + '/' + parts[parts.length - 1];
                    parts = value.split('\\');
                    changedValue = parts[parts.length - 2] + '/' + parts[parts.length - 1];
                    res[changedKey] = changedValue;
                }
            }
            return res;
        };

    grunt.log.writeln('srcBase: ' + grunt.option('srcBase'));
    grunt.log.writeln('srcPath: ' + srcPath);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        app: {
            bower: 'bower_components',
            node: 'node_modules',
            app: '<%= app.src %>/app',
            dist: '<%= app.src %>/dist',
            src: srcPath,
            images: '<%= app.src %>/images',
            cssDir: '<%= app.src %>/styles',
            cssFile: '<%= app.cssDir %>/main.css',
            scss: '<%= app.cssDir %>/scss',
            js: '<%= app.src %>/scripts'
        },

        copy: {
            css: {
                files: [{
                    nonull: true,
                    dest: '<%= app.cssDir %>/vendor/',
                    src: ['<%= app.bower %>/bootstrap/dist/css/*.css', '!<%= app.bower %>/bootstrap/dist/css/*.min.css',
                        '<%= app.bower %>/fancybox/source/*.css', '!<%= app.bower %>/fancybox/source/*.min.css',
                        '<%= app.bower %>/flickity/dist/*.css', '!<%= app.bower %>/flickity/dist/*.min.css',
                        '<%= app.node %>/animate.css/*.css', '!<%= app.node %>/animate.css/*.min.css',
                        '<%= app.bower %>/magnific-popup/dist/*.css', '!<%= app.bower %>/magnific-popup/dist/*.min.css',
                        '<%= app.bower %>/flexboxgrid/dist/*.css', '!<%= app.bower %>/flexboxgrid/dist/*.min.css'
                    ],
                    dot: true,
                    flatten: true,
                    expand: true,
                    rename: function (dest, src) {
                        return dest + "_" + src.replace('.css', '.scss');
                    }
                }]
            },
            js: {
                files: [{
                    nonull: true,
                    dest: '<%= app.js %>/vendor/',
                    src: ['<%= app.bower %>/flickity/dist/flickity.pkgd.js',
                        '<%= app.bower %>/fancybox/source/jquery.fancybox.js',
                        '<%= app.bower %>/retina.js/src/retina.js',
                        '<%= app.node %>/waypoints/lib/noframework.waypoints.js',
                        '<%= app.bower %>/bootstrap/dist/js/bootstrap.js',
                        '<%= app.bower %>/magnific-popup/dist/jquery.magnific-popup.js'
                    ],
                    dot: true,
                    flatten: true,
                    expand: true
                }]
            },
            html: {
                src: '<%= app.src %>/index.html',
                dest: '<%= app.dist %>/index.html'
            },
            init: {
                flatten: true,
                expand: true,
                src: '<%= app.src %>/init/*.js',
                dest: '<%= app.dist %>/init/'
            },
            jquery: {
                flatten: true,
                expand: true,
                dest:'<%= app.src %>/init/',
                src: '<%= app.bower %>/jquery/dist/jquery.js'
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: 'nested',
                    sourceMap: false,
                    sourceComments: true
                },
                files: {
                    '<%= app.cssDir %>/main.css': '<%= app.scss %>/application.scss',
                    '<%= app.cssDir %>/vendor.css': '<%= app.cssDir %>/vendor/vendors.scss'
                }
            },
            release: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: true,
                    sourceComments: false
                },
                files: {
                    '<%= app.dist %>/css/main.min.css': '<%= app.scss %>/application.scss',
                    '<%= app.dist %>/css/vendor.min.css': '<%= app.cssDir %>/vendor/vendors.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                map: false
            },
            app: {
                src: ['<%= app.cssDir %>/main.css', '<%= app.dist %>/css/main.min.css']
            },
            vendor: {
                src: ['<%= app.cssDir %>/vendor.css', '<%= app.dist %>/css/vendor.min.css']
            }
        },

        clean: {
            options: {
                force: true
            },
            all: [
                '<%= app.cssDir %>/main.*',
                '<%= app.cssDir %>/vendor.*',
                '<%= app.dist %>/css/main.*',
                '<%= app.dist %>/css/vendor.*',
                '<%= app.dist %>/scripts/vendor.*',
                '<%= app.dist %>/scripts/main.*',
                '<%= app.dist %>/init/*.*'
            ]
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                banner: '\'use strict\';',
                compress: {
                    sequences: true,
                    join_vars: true,
                    comparisons: true,
                    conditionals: true,
                    if_return: true,
                    dead_code: true,
                    unused: true
                },
                mangle: false
            }
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= app.dist %>/css/*.css'
            },
            js: {
                src: '<%= app.dist %>/scripts/*.js'
            }
        },

        useminPrepare: {
            html: '<%= app.src %>/index.html',
            css: '<%= app.cssDir %>/**/*.css',
            options: {
                dest: '<%= app.dist %>'
            }
        },

        usemin: {
            html: '<%= app.dist %>/index.html',
            map: ['<%= app.js %>/*.js', '<%= app.cssDir %>/*.css'],
            options: {
                patterns: {
                    map: [[/sourceMappingURL=([^*/\s]+)/gm, 'Update references to revved maps in css and script files']]
                },
                blockReplacements: {
                    js: function (block) {
                        var summary;
                        summary = modifyFileRevSummary(grunt.filerev.summary);
                        return '<script src="' + summary[block.dest] + '"></script>';
                    },
                    css: function (block) {
                        var summary;
                        summary = modifyFileRevSummary(grunt.filerev.summary);
                        return '<link rel="stylesheet" href="' + summary[block.dest] + '" />';
                    },
                    map: function (block) {
                        var summary;
                        summary = modifyFileRevSummary(grunt.filerev.summary);
                        return 'sourceMappingURL=' + summary[block.dest];
                    }
                }
            }
        },

        includeSource: {
            options: {
                basePath: '<%= app.src %>',
                baseUrl: ''
            },
            myTarget: {
                files: {
                    '<%= app.src %>/index.html': '<%= app.src %>/index.tpl.html'
                }
            }
        },

        watch: {
            options: {
                spawn: true,
                interrupt: true
            },
            styles: {
                files: ['<%= app.scss %>/**/*.scss', '<%= app.js %>/**/*.scss', '<%= app.cssDir %>/vendor/**/*.scss', '<%= app.src %>/*.tpl.html'],
                tasks: ['sass:dev', 'autoprefixer', 'includeSource']
            }
        }
    });

    // usemin creates the configuration for :generated subtasks
    grunt.registerTask('default', ['dev', 'watch']);
    grunt.registerTask('release', ['clean:all', 'includeSource', 'sass:release', 'autoprefixer', 'useminPrepare', 'concat:generated',
        'uglify:generated', 'filerev', 'copy:init', 'copy:html', 'usemin']);
    grunt.registerTask('dev', ['clean:all', 'copy:js', 'copy:jquery', 'copy:css','sass:dev', 'autoprefixer', 'includeSource']);
    grunt.registerTask('update', ['dev']);
    grunt.registerTask('unitTest', ['clean:all', 'useminPrepare', 'uglify:generated', 'karma:unit', 'karma:unit_legacy']);
};