pipeline {
    agent none

    environment {
        DOCKER_REPO = "fullstack-app"
        DOCKER_TAG = "latest"
        // 🌟 保留 DOCKER_API_VERSION 以确保 docker 命令兼容性
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
                    // 使用带有 Docker 客户端的镜像
                    image 'docker:24.0-cli'
                    // 挂载 Docker Socket 以便执行 docker-compose
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo "📦 使用 docker-compose.yml 构建镜像..."
                sh 'docker-compose build' 
            }
        }

        // ❌ 移除 Docker Compose Push 阶段，不再需要 Docker Hub 账号

        stage('Deploy') {
            agent {
                docker {
                    // 仍然需要 docker-compose 和 docker CLI 来执行部署命令
                    image 'docker:24.0-cli'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo '🚀 使用本地构建的镜像部署应用...'
                // 停止并清理旧容器
                sh 'docker-compose down'
                // 启动新容器，并添加 --build 确保在部署前如果需要会重新构建最新的本地代码（尽管前面已经构建过，作为安全措施）
                sh 'docker-compose up -d --build'
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