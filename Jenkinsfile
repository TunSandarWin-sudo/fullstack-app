pipeline {
    // 更改 agent any 为 Docker 镜像，确保环境预装了 Node.js/npm
    agent {
        docker {
            image 'node:lts-alpine' // 预装了 npm 和 Node.js
            // 挂载 Docker socket，使得容器内可以执行 docker build/push/compose 命令
            args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
        }
    }

    environment {
        // 更改 DOCKER_IMAGE 以使用您的 Docker Hub 用户名，方便 Push
        DOCKER_REPO = "yoursudo/fullstack-app" // 请替换为您的 Docker Hub 用户名/组织名
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                // 在 Declarative Pipeline 中，如果 agent 被定义，默认会执行一次 Checkout。
                // 保留此步骤以明确表示操作，但可以考虑删除以避免重复。
                checkout scm 
            }
        }

        stage('Install and Build') { // 合并 Install Dependencies 和 Build Frontend
            steps {
                // 因为在 Docker 容器中运行，Node/npm 环境是干净且可用的
                echo '🛠️ 安装后端依赖...'
                sh 'cd backend && npm install'
                
                echo '🛠️ 安装前端依赖...'
                sh 'cd frontend && npm install'
                
                echo '🏗️ 构建前端应用...'
                // npm run build 必须在 frontend 目录下执行
                sh 'cd frontend && npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                // 在 Jenkins Workspace 的根目录执行 Docker build，方便访问 Dockerfile
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
            // **注意：** 部署阶段需要在目标服务器上运行，
            // 这里的 sh 命令是在 Jenkins Agent (即 Node 容器)中执行的。
            // 除非您的 Agent 就是目标服务器，否则此步骤需要使用 SSH 或 Kubernetes 客户端来远程执行。
            steps {
                echo '🚀 正在部署应用...'
                // 仅用于演示：在 Agent 上执行 docker-compose
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