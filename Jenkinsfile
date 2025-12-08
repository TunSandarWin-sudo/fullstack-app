pipeline {
    agent none

    environment {
        DOCKER_REPO = "fullstack-app"
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                echo '🚚 正在检出代码...'
                checkout scm
            }
        }

        stage('Install and Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root'
                }
            }
            steps {
                echo '🛠️ 正在安装依赖并构建前端...'
                sh 'cd backend && npm install'
                sh 'cd 02_frontend && npm install'
                sh 'cd 02_frontend && npm run build'
            }
        }

        stage('Docker Compose Build') {
            agent {
                docker {
                    image 'docker/compose:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo "📦 使用 docker-compose.yml 构建镜像..."
                // 🌟 修正：使用 docker compose build
                sh 'docker compose build' 
            }
        }

        stage('Docker Compose Push') {
            agent {
                docker {
                    image 'docker/compose:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo '🔑 正在登录 Docker Hub...'
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    echo '⬆️ 推送镜像到 Docker Hub...'
                    // 🌟 修正：使用 docker compose push
                    sh 'docker compose push'
                }
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'docker/compose:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo '🚀 使用 docker-compose.yml 部署应用...'
                // 🌟 修正：使用 docker compose down && docker compose up -d
                sh 'docker compose down && docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ 部署成功！'
        }
        failure {
            echo '❌ 构建失败，请检查日志。'
        }
    }
}