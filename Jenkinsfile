pipeline {
    agent none

    environment {
        DOCKER_REPO = "fullstack-app"
        DOCKER_TAG = "latest"
        DOCKER_API_VERSION = "1.44"
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

                // 确保 .env 文件存在于工作区
                sh 'echo "MYSQL_ROOT_PASSWORD=supersecretroot" > backend/.env'
                sh 'echo "MYSQL_PASSWORD=supersecretapp" >> backend/.env'
                
                sh 'echo "REACT_APP_API_URL=http://localhost:4000" > 02_frontend/.env'
            }
        }

        stage('Docker Compose Build') {
            agent {
                docker {
                    // 🌟 最终修正：更换为带有更新 Docker 客户端的镜像
                    image 'docker:24.0-cli'
                    // 保持 V1 命令兼容性所需的参数
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo "📦 使用 docker-compose.yml 构建镜像..."
                // 保持 V1 语法
                sh 'docker-compose build' 
            }
        }

        stage('Docker Compose Push') {
            agent {
                docker {
                    // 🌟 最终修正：更换为带有更新 Docker 客户端的镜像
                    image 'docker:24.0-cli'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo '🔑 正在登录 Docker Hub...'
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    echo '⬆️ 推送镜像到 Docker Hub...'
                    // 保持 V1 语法
                    sh 'docker-compose push'
                }
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    // 🌟 最终修正：更换为带有更新 Docker 客户端的镜像
                    image 'docker:24.0-cli'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo '🚀 使用 docker-compose.yml 部署应用...'
                // 保持 V1 语法
                sh 'docker-compose down && docker-compose up -d'
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