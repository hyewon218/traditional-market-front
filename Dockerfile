# Step 1: Build the React app
FROM node:16-alpine AS build
WORKDIR /app
#COPY . .
# package.json과 package-lock.json 먼저 복사
COPY package*.json ./
RUN npm install --legacy-peer-deps # 종속성 충돌 무시하고 설치

# 소스 코드 복사
COPY src ./src
COPY public ./public
#COPY .env ./

RUN npm run build

# Step 2: Nginx로 서비스
FROM nginx:alpine

# 기본 Nginx 설정 파일 덮어쓰기 (rm -rf는 생략)
COPY conf/conf.d/default.conf /etc/nginx/conf.d/default.conf

# 기본 베이스로 설정한 nginx의 디렉토리에서 아래 경로의 폴더 삭제
# RUN rm -rf /etc/nginx/conf.d
# 로컬에서 만든 conf 폴더를 nginx의 서버에 복사
# COPY conf /etc/nginx

# nginx 가 동작하기 위해 필요한 파일들을 시스템으로 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]