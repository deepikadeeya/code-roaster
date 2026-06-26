pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                echo '🔍 Validating project files...'
                script {
                    def files = ['index.html', 'style.css', 'script.js']
                    files.each { file ->
                        if (fileExists(file)) {
                            echo "✅ Found: ${file}"
                        } else {
                            error "❌ Missing file: ${file}"
                        }
                    }
                }
            }
        }

        stage('Lint HTML') {
            steps {
                echo '🧹 Checking HTML structure...'
                script {
                    def html = readFile('index.html')
                    if (html.contains('<!DOCTYPE html>')) {
                        echo '✅ DOCTYPE declaration found'
                    } else {
                        error '❌ Missing DOCTYPE in index.html'
                    }
                    if (html.contains('<title>')) {
                        echo '✅ Title tag found'
                    } else {
                        error '❌ Missing <title> tag'
                    }
                    echo '✅ HTML lint passed'
                }
            }
        }

        stage('Check CSS') {
            steps {
                echo '🎨 Verifying CSS file...'
                script {
                    def css = readFile('style.css')
                    def ruleCount = css.count('{')
                    echo "✅ Found ${ruleCount} CSS rule blocks"
                    if (ruleCount < 1) {
                        error '❌ CSS file appears empty'
                    }
                }
            }
        }

        stage('Check JavaScript') {
            steps {
                echo '⚡ Verifying JavaScript file...'
                script {
                    def js = readFile('script.js')
                    if (js.contains('function')) {
                        echo '✅ JavaScript functions detected'
                    } else {
                        error '❌ No functions found in script.js'
                    }
                    echo '✅ JavaScript check passed'
                }
            }
        }

        stage('Build Summary') {
            steps {
                echo '📦 Generating build summary...'
                script {
                    def html = readFile('index.html')
                    def css  = readFile('style.css')
                    def js   = readFile('script.js')

                    def htmlLines = html.split('\n').length
                    def cssLines  = css.split('\n').length
                    def jsLines   = js.split('\n').length
                    def total     = htmlLines + cssLines + jsLines

                    echo """
╔══════════════════════════════════════╗
║       🔥 ROAST MY CODE — BUILD       ║
╠══════════════════════════════════════╣
║  index.html  : ${htmlLines.toString().padLeft(5)} lines           ║
║  style.css   : ${cssLines.toString().padLeft(5)} lines           ║
║  script.js   : ${jsLines.toString().padLeft(5)} lines           ║
║  Total       : ${total.toString().padLeft(5)} lines           ║
╠══════════════════════════════════════╣
║  Status      : ✅ BUILD SUCCESSFUL   ║
╚══════════════════════════════════════╝
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Roast My Code...'
                echo '✅ Files are ready to serve!'
                echo '🌐 Open index.html in your browser to use the app.'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully! Your code is ready to be roasted.'
        }
        failure {
            echo '💥 Pipeline failed. Looks like your pipeline code needs a roast too.'
        }
    }
}
