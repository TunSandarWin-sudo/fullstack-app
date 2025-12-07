pipeline {
    agent none 

    environment {
        DOCKER_REPO = "fullstack-app" 
        DOCKER_TAG = "latest"
    }

    stages {
        // ... (Checkout 阶段保持不变) ...
        stage('Checkout') {
            agent any 
            steps {
                echo '🚚 正在检出代码...'
                checkout scm
            }
        }

        // ... (Install and Build 阶段保持不变，已解决权限问题) ...
        stage('Install and Build') {
            agent {
                docker {
                    image 'node:20-alpine' 
                    args '-u root' 
                }
            }
            steps {
                echo '🛠️ 正在安装依赖并构建前端...'
                sh 'node -v' 
                sh 'cd backend && npm install'
                sh 'cd 02_frontend && npm install'
                sh 'cd 02_frontend && npm run build'
            }
        }

        stage('Docker Build') {
            agent {
                docker {
                    image 'docker:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root' 
                }
            }
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                // 🌟 最终修正：明确指定根目录下的 Dockerfile
                sh "docker build -t ${env.DOCKER_REPO}:${env.DOCKER_TAG} -f ./Dockerfile ."
            }
        }

        // ... (Docker Push 和 Deploy 阶段保持不变) ...
        stage('Docker Push') {
            agent {
                docker {
                    image 'docker:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    echo '🔑 正在登录 Docker Hub...'
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
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