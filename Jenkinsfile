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

        stage('Docker Push') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials-system',
                usernameVariable: 'DOCKERHUB_USERNAME',
                passwordVariable: 'DOCKERHUB_TOKEN'
            )
        ]) {
            bat 'echo Docker username is %DOCKERHUB_USERNAME%'
            bat 'if defined DOCKERHUB_TOKEN (echo Docker token is PRESENT) else (echo Docker token is MISSING)'
        }
    }
}
    }
}