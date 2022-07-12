# student-word-counter
🧑‍🎓 학생부 / 자소서 글자수 계산기

*로컬 다중 저장 지원

## 지원하는 기능
0. 공백 포함 글자수, 공백 제외 글자수, NEIS 기준 글자수 바이트
1. 브라우저 자동 저장
2. 다중 글 저장
3. 글 백업/복구

## 도움말
### 글 삭제는 어떻게 하나요?
제목과 본문을 모두 지우신 다음에 다른 글로 이동하시면 완전히 삭제됩니다.

### 다른 기기에서 사용할 수 있나요?
브라우저에 저장하기 때문에 자동 저장 기능으로는 옮길 수 없습니다.

대신 백업/복원 기능을 사용하여 다른 기기에서 이어서 작업할 수 있습니다. (복원시 데이터를 덮어쓰므로 주의해주세요)

## 만든 이유
자기소개서 쓰다가 필 받아서 만들었습니다.

## 오류가 났다면
예외처리를 설렁설렁하다보니 치명적인 오류가 많이 발생할 수 있습니다. 일단은 제가 사용하면서 문제점은 고치고 있으나 혹시라도 문제가 발생했다면 본 레포지토리에 이슈로 남겨주세요.

별도의 이슈 양식은 없습니다만, 최소한 `화면 스크린샷`, `개발자 콘솔 스크린샷 (또는 내용)`, `기본적인 증상`, `발생 시나리오` 정도는 알려주시면 감사하겠습니다.

혹은 직접 고치셔도 됩니다. 사실상 `src/App.tsc` 파일 하나로 돌아가는 아이라서 직접 해결하시는데 크게 어렵지는 않으실 거에요!

## 영감
이 프로젝트는 https://github.com/hjh010501/neis-counter 에서 아이디어와 디자인, 글자수 카운팅 코드(MIT)을 차용하였습니다. 물론 시작은 단순히 카운터만 만들려고 했는데... 이상한게 많이 추가됬네요.

## 기여
무엇이든 얼마든지 언제든지 환영입니다. 자소서 쓰는 중간에 살짝 만든거라 코드가 부족한 부분이 많습니다.
