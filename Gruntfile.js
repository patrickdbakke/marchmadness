'use strict';

var config = require('./config');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: ['./*.js', 'static/js/**/*.js', '!static/js/templates.js','!static/js/libs/**/*.js',  '!static/js/bower_components/**/*.js']
        },
        clean: {
            dev: {
                src: ['static/css/**/*.css', 'static/css/**/*.css.map']
            },
            deps: {
                src: ['node_modules', 'static/bower_components']
            },
            tmp: {
                src: ['.tmp', '.sass-cache', 'static/.tmp', 'static/.sass-cache']
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: ['static/scss'],
                    cssDir: ['static/css'],
                    sourcemap: true
                }
            },
            dist: {
                options: {
                    sassDir: ['static/scss'],
                    cssDir: ['static/css'],
                    quiet: true,
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },
        html2js: {
            options: {
                base: 'static'
            },
            marchmadness: {
                src: ['static/views/**/*.html'],
                dest: 'static/js/templates.js'
            }
        },
        watch: {
            styles: {
                files: ['static/scss/**'],
                tasks: ['compass:dev']
            },
            templates: {
                files: ['static/views/**'],
                tasks: ['html2js']
            }
        },
        ngAnnotate: {
            options: {
                add: true
            }
        },
        connect: {
            src: {
                options: {
                    port: config.port,
                    base: 'static',
                    keepalive: true
                }
            },
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            serve: ['watch', 'connect:src']
        }
    });

    grunt.registerTask('dev', ['clean:dev', 'compass:dev', 'html2js']);
    grunt.registerTask('serve', ['clean:dev', 'dev', 'concurrent:serve']);
    grunt.registerTask('default', ['jshint', 'serve']);

};