/*
*
*  ______  ______ _______ ______  _______
* |  ____ |_____/ |_____| |_____] |______
* |_____| |    \_ |     | |_____] ______|
*
* Grabs - Front-End Development Environment
*
*/
module.exports = function (grunt) {
    var myHash = new Date().valueOf().toString(),
        sortedJsPaths = [
            'js/components/angular/*.js',
            'js/components/angular-route/*.js',
            'js/**/*.js',
            'views/**/*.js'
        ],
        sortedCssPaths = [
            'css/reset.',
            'css/global.',
            'css/**/*.',
            'views/**/*.'
        ],
        editFilePaths = function (pathsArray, rootDirectory, fileType) {
            var paths = [];

            pathsArray.map(function (path) {
                paths.push(rootDirectory + path + fileType);
            });

            return paths;
        },
        createFilePaths = function (paths, oldType, newType) {
            var config = {},
                files = grunt.file.expand({cwd: 'app'}, editFilePaths(paths, '', oldType));

            files.map(function (path) {
                config['build/' + path.replace(oldType, newType)] = 'app/' + path;
            });

            return config;
        };

    grunt.initConfig({
        hash: myHash,

        clean: {
            build: 'build'
        },

        stylus: {
            development: {
                options: {
                    paths: ['app/css'],
                    compress: false,
                    linenos: false
                },
                files: createFilePaths(sortedCssPaths, 'styl', 'css')
            },
            live: {
                options: {
                    paths: ['app/css'],
                    compress: true
                },
                files: {
                    'build/css/app.min.<%= hash %>.css' : editFilePaths(sortedCssPaths, 'app/', 'styl')
                }
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: 'app',
                src: ['views/**/*.html', '!views/index.html'],
                dest: 'build',
                filter: 'isFile'
            },
            json: {
                expand: true,
                cwd: 'app',
                src: 'views/**/*.json',
                dest: 'build',
                filter: 'isFile'
            },
            img: {
                expand: true,
                cwd: 'app',
                src: ['img/**/*.*', '!img/sprite/**/*.png', '!img/sprite-retina/**/*.png'],
                dest: 'build'
            },
            font: {
                expand: true,
                cwd: 'app',
                src: 'font/**.*',
                dest: 'build'
            },
            js: {
                expand: true,
                cwd: 'app',
                src: ['js/**/*', 'views/**/*.js'],
                dest: 'build',
                filter: 'isFile'
            }
        },

        eslint: {
            options: {
                config: '.eslintrc'
            },
            target: ['app/views/**/*.js']
        },

        plato: {
            report: {
                files: {
                    'reports/': ['app/js/**/*.js', 'app/views/**/*.js', '!app/js/components/**/*.js'],
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost',
                open: true,
                middleware: function(connect, options, middlewares) {
                    var modRewrite = require('connect-modrewrite');
                    middlewares.unshift(modRewrite(['!(\\..+)$ / [L]']));
                    return middlewares;
                }
            },
            server: {
                options: {
                    base: 'build'
                }
            },
            report: {
                options: {
                    base: 'reports',
                    keepalive: true
                }
            }
        },

        bower: {
            options: {
                targetDir: 'app/js/components',
                cleanTargetDir: false,
                cleanBowerDir: true,
                verbose: true
            },
            install: {}
        },

        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            index: {
                src: 'build/index.html',
                dest: 'build/index.html'
            },
            views: {
                expand: true,
                cwd: 'app',
                src: ['views/**/*.html', '!views/index.html'],
                dest: 'build'
            }
        },

        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: 'img/**/*.png',
                    dest: 'build',
                    ext: '.png'
                }]
            }
        },

        uglify: {
            options: {
                'lift-vars': false,
                compress: false
            },
            live: {
                src: editFilePaths(sortedJsPaths, 'app/', ''),
                dest: 'build/js/app.min.<%= hash %>.js',
                options: {
                    sourceMap: false,
                    sourceMapIncludeSources: true
                }
            }
        },

        traceur: {
            options: {
                experimental: true,
                blockBinding: true,
                moduleNaming: {
                    stripPrefix: "src/es6",
                    addPrefix: "com/grabs/project"
                },
                copyRuntime: 'build/es6/'
            },
            custom: {
                files: [{
                    expand: true,
                    cwd: 'app/es6/',
                    src: '*.js',
                    dest: 'build/es6/'
                }]
            }
        },

        notify_hooks: {
            options: {
                enabled: true,
                title: "Grabs"
            }
        },

        notify: {
            watch: {
                options: {
                    message: 'Grabs is ready!'
                }
            }
        },

        sprite: {
            normal: {
                src: 'app/img/sprite/**/*.*',
                dest: 'build/img/sprite-<%= hash %>.png',
                destCss: 'app/css/sprite.styl',
                imgPath: '/img/sprite-<%= hash %>.png',
                algorithm: 'binary-tree',
                padding: 1
            },
            retina: {
                src: 'app/img/sprite-retina/**/*.*',
                dest: 'build/img/sprite-retina-<%= hash %>.png',
                destCss: 'app/css/sprite-retina.styl',
                imgPath: '/img/sprite-retina-<%= hash %>.png',
                algorithm: 'binary-tree',
                padding: 2,
                cssVarMap: function (sprite) {
                    sprite.name = sprite.name + '-2x';
                }
            }
        },

        template: {
            development: {
                src: 'app/views/index.html',
                dest: 'build/index.html',
                options: {
                    data: function () {
                        return {
                            development: true,
                            cssFiles: grunt.file.expand({cwd: 'build'}, editFilePaths(sortedCssPaths, '', 'css')),
                            jsFiles: grunt.file.expand({cwd: 'app'}, sortedJsPaths)
                        }
                    }
                }
            },
            live: {
                src: 'app/views/index.html',
                dest: 'build/index.html',
                options: {
                    data: {
                        development: false,
                        hash: myHash
                    }
                }
            }
        },

        watch: {
            all: {
                options: {
                    livereload: 35729
                },
                files: 'app/**/*'
            },
            html: {
                files: 'app/**/*.html',
                tasks: ['copy:html', 'template:development']
            },
            css: {
                files: 'app/**/*.styl',
                tasks: 'stylus:development'
            },
            js: {
                files: 'app/**/*.js',
                tasks: ['copy:js', 'eslint']
            },
            json: {
                files: 'app/**/*.json',
                tasks: 'copy:json'
            }
        }
    });

    require('load-grunt-tasks')(grunt); // Load Npm Tasks
    grunt.task.run('notify_hooks'); // Run Notify

    // $ grunt
    grunt.registerTask('default', [
        'clean',
        'copy:html',
        'copy:json',
        'copy:img',
        'copy:font',
        'copy:js',
        'sprite',
        'stylus:development',
        'template:development',
        'connect:server',
        'notify:watch',
        'watch'
    ]);

    // $ grunt live
    grunt.registerTask('live', [
        'clean',
        'copy:json',
        'copy:img',
        'copy:font',
        'sprite',
        'stylus:live',
        'htmlmin:views',
        'uglify:live',
        'imagemin',
        'template:live',
        'htmlmin:index',
        'connect:server',
        'watch'
    ]);

    // $ grunt report
    grunt.registerTask('report', [
        'plato:report',
        'connect:report'
    ]);

    // $ grunt es6
    grunt.registerTask('es6', [
        'traceur'
    ]);
};
