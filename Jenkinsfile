pipeline {
    // 移除全局 Agent，使用 agent none，表示我们将为每个 Stage 指定 Agent
    agent none 

    environment {
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
            // 此阶段需要 Node.js 环境，使用 node:20-alpine 容器
            agent {
                docker {
                    image 'node:20-alpine' 
                    // 🌟 解决权限问题：强制容器以 root 用户运行
                    args '-u root' 
                }
            }
            steps {
                echo '🛠️ 正在安装依赖并构建前端...'
                sh 'node -v' 
                sh 'cd backend && npm install'
                sh 'cd 02_frontend && npm install'
                sh 'cd 02_frontend && npm run build' // 现在将有权限写入 dist 目录
            }
        }

        stage('Docker Build') {
            // 此阶段需要 Docker 客户端，使用 docker:latest 容器
            agent {
                docker {
                    image 'docker:latest'
                    // 挂载 Docker Socket，允许容器与宿主机 Docker 守护进程通信
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
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
                    image 'docker/compose:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo '🚀 正在部署应用...'
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