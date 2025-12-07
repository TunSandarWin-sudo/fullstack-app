pipeline {
    // 使用 Docker Agent，强制构建在 Node.js 20 LTS 环境中运行
    agent {
        docker {
            image 'node:20-alpine' 
            // 挂载 Docker Socket，允许容器内执行 'docker build', 'docker push' 等命令
            args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
        }
    }

    environment {
        // TODO: 建议将 DOCKER_REPO 替换为您的 Docker Hub 用户名/组织名
        DOCKER_REPO = "fullstack-app" 
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🚚 正在检出代码...'
                checkout scm
            }
        }

        stage('Install and Build') {
            steps {
                echo '🛠️ 正在安装依赖并构建前端...'
                // 确保 Node.js 20 LTS 环境可用
                sh 'node -v' 
                
                // 后端依赖安装
                sh 'cd backend && npm install'
                
                // 前端依赖安装 (您的目录名为 02_frontend)
                sh 'cd 02_frontend && npm install'
                
                // 前端构建，现在 Node.js 版本满足要求，不会报错
                sh 'cd 02_frontend && npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                // 在 Jenkins Workspace 的根目录执行 Docker build
                sh "docker build -t ${env.DOCKER_REPO}:${env.DOCKER_TAG} ."
            }
        }

        stage('Docker Push') {
            steps {
                // 使用 Jenkins 凭证管理中的 ID: 'dockerhub-creds'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo '🔑 正在登录 Docker Hub...'
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    
                    echo '⬆️ 正在推送 Docker 镜像...'
                    sh "docker push ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 正在部署应用...'
                // 此命令在 Jenkins Agent 宿主机上执行 (通过 Docker Socket)
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