
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'YOUR_DOCKERHUB_USERNAME/myportfolio'
        CONTAINER_NAME = 'madhan-portfolio'
        HOST_PORT = '8081'
    }

    stages {

        stage('1. GitHub Checkout') {
            steps {
                checkout scm
            }
        }

        stage('2. Docker Build') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('3. Docker Hub Login & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DH_PASS" | docker login \
                        -u "$DH_USER" --password-stdin

                        docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${IMAGE_NAME}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('4. Deploy from Docker Hub') {
            steps {
                sh '''
                    docker pull ${IMAGE_NAME}:${BUILD_NUMBER}

                    docker rm -f ${CONTAINER_NAME} || true

                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    --restart unless-stopped \
                    -p ${HOST_PORT}:80 \
                    ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo 'Portfolio deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins console output.'
        }
    }
}
