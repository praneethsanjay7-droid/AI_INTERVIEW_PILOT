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
stage('Docker Hub Login Test') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-credentials-system',
                usernameVariable: 'DOCKERHUB_USERNAME',
                passwordVariable: 'DOCKERHUB_TOKEN'
            )
        ]) {
            powershell '''
                $env:DOCKER_CONFIG = "$env:WORKSPACE\\.docker"
                New-Item -ItemType Directory -Force -Path $env:DOCKER_CONFIG | Out-Null
                $env:DOCKERHUB_TOKEN | docker login -u $env:DOCKERHUB_USERNAME --password-stdin
            '''
        }
    }
}

        stage('Start Application') {
    steps {
        withCredentials([
            string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
            string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
            string(credentialsId: 'cloudinary-api-secret', variable: 'CLOUDINARY_API_SECRET'),
            string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY')
        ]) {
            powershell '''
                @"
PORT=5000
MONGO_URI=$env:MONGO_URI
CLOUDINARY_API_KEY=$env:CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$env:CLOUDINARY_API_SECRET
GEMINI_API_KEY=$env:GEMINI_API_KEY
"@ | Set-Content -Path "server/.env"
            '''

            bat 'docker-compose -f infra/docker/docker-compose.yml up -d'
        }
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