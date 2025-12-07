pipeline {
    // ✅ 必须是 agent none，因为 docker agent 是在 stage 级别指定的
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
            // ✅ stage 级别的 docker agent
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
            // ✅ stage 级别的 docker agent (已包含所有修复)
            agent {
                docker {
                    image 'docker:latest'
                    args '--entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -u root' 
                }
            }
            steps {
                echo "📦 正在构建 Docker 镜像: ${env.DOCKER_REPO}:${env.DOCKER_TAG}"
                // 最终修正：明确指定根目录下的 Dockerfile
                sh "docker build -t ${env.DOCKER_REPO}:${env.DOCKER_TAG} -f ./Dockerfile ."
            }
        }

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