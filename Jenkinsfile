pipeline {
    agent {
        docker { image 'node:8-alpine' }
    }

    stages {
        stage('Checking out project') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
              sh 'npm i'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
