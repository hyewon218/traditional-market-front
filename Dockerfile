# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /app
# 소스 코드 복사
COPY . .

RUN npm install --legacy-peer-deps # 종속성 충돌 무시하고 설치

RUN npm run build

# Step 2: Nginx로 서비스
FROM nginx:alpine

# 기본 nginx 설정 파일을 삭제한다. (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf
# custom 설정파일을 컨테이너 내부로 복사한다.
COPY conf/conf.d/default.conf /etc/nginx/conf.d/default.conf

# nginx 가 동작하기 위해 필요한 파일들을 시스템으로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80
EXPOSE 443

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]