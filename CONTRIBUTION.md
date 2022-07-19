# 기여

무엇이든 얼마든지 언제든지 환영입니다. 자소서 쓰는 중간에 살짝 만든거라 코드가 부족한 부분이 많습니다.

## 시스템 요구사항

- Node.JS
- yarn

## 실행 방법

- yarn으로 패키지들을 설치해줍니다.
  ```
  yarn
  ```
- 파이어베이스 관련 환경변수들을 설정해줍니다. 파이어베이스 콘솔에서 앱을 만든 후 Project Settings > Your apps 안의 정보를 `.env` 파일에 저장하면 됩니다. dotenv 파일 형식은 `.env.sample`을 참조해주세요.
- 개발서버를 실행합니다.
  ```
  yarn start
  ```

## 파이어베이스 설정

#### 프로젝트 생성

- [파이어베이스 홈페이지](https://firebase.google.com/)에서 콘솔을 엽니다.
![image](https://user-images.githubusercontent.com/8978815/179660821-9aa24634-7801-4ff2-8194-94aa5d3b1fd7.png)
- 새 프로젝트를 생성합니다.
![image](https://user-images.githubusercontent.com/8978815/179660903-7a6c4b50-75c5-4257-b9dc-8205f3cb9768.png)
- 생성된 프로젝트에 웹앱을 추가합니다.
![image](https://user-images.githubusercontent.com/8978815/179661871-51b4026c-f152-478d-9fbc-811565252400.png)
![image](https://user-images.githubusercontent.com/8978815/179661946-88391fb8-8a79-4386-a77c-815a06895730.png)
- 생성된 앱의 config를 `.env` 파일에 저장합니다. `.env.sample` 파일을 참조해주세요.
![image](https://user-images.githubusercontent.com/8978815/179662303-6c49f256-5d8c-4afe-bdda-21c7024b0119.png)

#### 로그인 활성화

- "Build" > "Authentication" 메뉴를 엽니다.
![image](https://user-images.githubusercontent.com/8978815/179660997-349be253-2b5b-4609-be42-2f25c7a01269.png)
- "Sign-in method" 탭에서 "Add new provider"을 선택합니다.
![image](https://user-images.githubusercontent.com/8978815/179661141-3cdb3177-6d22-4b4c-b3d4-ebbfa254f785.png)
- "Email/Password" 로그인을 활성화 시켜줍니다.
![image](https://user-images.githubusercontent.com/8978815/179661232-8234cd22-2558-4fc9-a9bf-3107efe94b71.png)

#### 데이터베이스 활성화

- "Build" > "Firestore Database" 메뉴를 엽니다. (주의: "Realtime Database"와는 다른 서비스입니다.)
![image](https://user-images.githubusercontent.com/8978815/179661451-12ebfae4-210d-4366-bb55-5d17eb98d4bf.png)
- 상단의 "Create Database" 버튼을 클릭하고 지역을 선택합니다.
- 데이터베이스가 생성되면 "Rules" 탭을 열고 권한설정을 다음과 같이 편집합니다.
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	match /document/{document} {
    	allow read, update, delete: if request.auth.uid == resource.data.author;
      allow create: if request.auth.uid != null && request.auth.uid == request.resource.data.author;
    }
  }
}
```
