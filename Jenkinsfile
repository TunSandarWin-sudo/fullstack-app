pipeline {
    // 移除全局 Agent，使用 agent none，表示我们将为每个 Stage 指定 Agent
    agent none 

    environment {
        // TODO: 建议将 DOCKER_REPO 替换为您的 Docker Hub 用户名/组织名
        DOCKER_REPO = "fullstack-app" 
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            // 使用任何可用的 Jenkins Agent 进行代码检出
            agent any 
            steps {
                echo '🚚 正在检出代码...'
                checkout scm
            }
        }

        stage('Install and Build') {
            // 此阶段需要 Node.js 环境，因此使用 node:20-alpine 容器
            agent {
                docker {
                    image 'node:20-alpine' 
                }
            }
            steps {
                echo '🛠️ 正在安装依赖并构建前端...'
                // 确保 Node.js 20 LTS 环境可用
                sh 'node -v' 
                
                // 后端依赖安装
                sh 'cd backend && npm install'
                
                // 前端依赖安装 (您的目录名为 02_frontend)
                sh 'cd 02_frontend && npm install'
                
                // 前端构建
                sh 'cd 02_frontend && npm run build'
            }
        }

        stage('Docker Build') {
            // 此阶段需要 Docker 客户端，因此使用 docker:latest 容器
            agent {
                docker {
                    image 'docker:latest'
                    // 挂载 Docker Socket，允许容器与宿主机 Docker 守护进程通信
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                // docker CLI 现在在容器内可用
                sh "docker build -t ${env.DOCKER_REPO}:${env.DOCKER_TAG} ."
            }
        }

        stage('Docker Push') {
            // 此阶段也需要 Docker 客户端
            agent {
                docker {
                    image 'docker:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                // 请确保您在 Jenkins 凭证管理中创建了 ID 为 'dockerhub-creds' 的用户名和密码凭证
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo '🔑 正在登录 Docker Hub...'
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    
                    echo '⬆️ 正在推送 Docker 镜像...'
                    sh "docker push ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                }
            }
        }

        stage('Deploy') {
            // 此阶段需要 Docker 客户端执行 docker-compose
            agent {
                docker {
                    image 'docker/compose:latest' // 使用包含 docker-compose 的镜像
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo '🚀 正在部署应用...'
                // 此命令在 docker/compose 容器内执行
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