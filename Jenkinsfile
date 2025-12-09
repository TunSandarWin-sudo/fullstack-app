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
                
                // 🌟 关键修复：使用 Docker Compose 服务名 'api' 解决前端连接问题
                sh 'echo "REACT_APP_API_URL=http://api:4000" > 02_frontend/.env'
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

        stage('Deploy') {
            agent {
                docker {
                    image 'docker:24.0-cli'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                echo '🚀 使用本地构建的镜像部署应用...'
                // 停止并清理旧容器
                sh 'docker-compose down'
                // 启动新容器，--build 可选但安全
                sh 'docker-compose up -d --build'
            }
        }
    }
    
    post {
        success {
            echo "✅ 构建成功，应用已部署！现在可以通过 http://<宿主机IP>:3000 访问前端。"
        }
        failure {
            echo "❌ 构建失败，请检查日志。"
        }
    }
}