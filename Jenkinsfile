pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out InterviewPilot code from GitHub'
            }
        }

        stage('Environment Check') {
            steps {
                bat 'java -version'
                bat 'git --version'
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
            }
        }

        stage('Application Check') {
            steps {
                dir('server') {
                    bat 'npm install'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -f infra/docker/server.Dockerfile -t interviewpilot-backend:%BUILD_NUMBER% .'
            }
        }

        stage('Start Application') {
    steps {
        bat 'where docker'
        bat 'where docker-compose'
        bat 'docker compose version'
        bat 'docker-compose version'
    }
}

        stage('Run Tests') {
            steps {
                dir('server') {
                    bat 'npm test'
                }
            }
        }
    }
}