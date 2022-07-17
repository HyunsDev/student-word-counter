import React, { useCallback, useEffect, useState } from "react";

import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

function counter(content: string) {
  if (!content) content = "";
  const english = content
    .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, "")
    .replace(/[0-9]/gi, "")
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
    .replace(/\s/gi, "")
    .replace(/\s/gi, "")
    .replace(/(\r\n\t|\n|\r\t)/gm, "");
  const korean = content
    .replace(/[a-zA-Z]/gi, "")
    .replace(/[0-9]/gi, "")
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
    .replace(/\s/gi, "")
    .replace(/(\r\n\t|\n|\r\t)/gm, "");
  const number = content
    .replace(/[a-zA-Z]/gi, "")
    .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, "")
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
    .replace(/\s/gi, "")
    .replace(/(\r\n\t|\n|\r\t)/gm, "");
  const special = content
    .replace(/[a-zA-Z]/gi, "")
    .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, "")
    .replace(/[0-9]/gi, "")
    .replace(/\s/gi, "")
    .replace(/(\r\n\t|\n|\r\t)/gm, "");
  const space = content
    .replace(/[a-zA-Z]/gi, "")
    .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, "")
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
    .replace(/[0-9]/gi, "")
    .replace(/(\r\n\t|\n|\r\t)/gm, "");
  const line = content
    .replace(/[a-zA-Z]/gi, "")
    .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, "")
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
    .replace(/[0-9]/gi, "")
    .replace(/ /gi, "");
  const result =
    english.length +
    korean.length * 3 +
    number.length +
    special.length +
    space.length +
    line.length * 2;
  return {
    noSpace: content.replace(/(\r\n\t|\n|\r\t)/gm, "").replace(/ /gi, "")
      .length,
    withSpace: content.length,
    byte: result,
  };
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divver = styled.div`
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const H1 = styled.h1`
  font-size: 16px;
  position: fixed;
  top: 20px;
  left: 20px;
`;

const A = styled.a`
  color: #000000;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Btn = styled.button`
  padding: 4px 8px;
  background-color: #000000;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
`;

const Btn2 = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  border: solid 1px #000;
  background-color: #fff;
  transition: 100ms;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleInput = styled.input`
  border: 0;
  border-bottom: solid 1px #cacaca;
  padding: 4px;
  font-size: 14px;
  width: 300px;
  font-weight: bold;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-weight: normal;
    color: #949494;
  }
`;

const TextDiv = styled.div`
  margin-top: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  border: solid 1px #cacaca;
  min-height: 300px;
  height: 400px;
  padding: 20px;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;

const TextCountDiv = styled.div`
  margin-top: 8px;
  font-weight: 800;
  font-size: 24px;
  text-align: right;
`;

const TextCountExplain = styled.div`
  font-size: 14px;
  color: #9b9b9b;
  font-weight: normal;
`;

const SaveLoadDiv = styled.div`
  position: fixed;
  left: 20px;
  top: 80px;
`;

const Writings = styled.div``;

const Writing = styled.div`
  cursor: pointer;
  font-size: 14px;

  border-radius: 4px;
  transition: 200ms;
  padding: 4px 8px;
  background-color: #ffffff;
  &:hover {
    background-color: #ececec;
  }

  span {
    color: #a3a3a3;
  }
`;

const Btns = styled.div`
  display: flex;
  gap: 8px;
`;

const BottomMenu = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

// 제목
function Title(props: {
  title: string;
  setTitle: Function;
  newWriting: Function;
  editTitle: Function;
}) {
  return (
    <TitleDiv>
      <TitleInput
        value={props.title}
        onChange={(e) => props.editTitle(e.target.value)}
        placeholder="제목 없음"
      />
      <Btn onClick={(e) => props.newWriting()}>새로운 글 만들기</Btn>
    </TitleDiv>
  );
}

// 글자 수
function TextCount(props: { text: string }) {
  const [res, setRes] = useState({
    noSpace: 0,
    withSpace: 0,
    byte: 0,
  });

  useEffect(() => {
    setRes(counter(props.text));
  }, [props.text]);

  return (
    <TextCountDiv>
      공백 제외 {res.noSpace}자, 공백 포함 {res.withSpace}자, {res.byte} 바이트
      <br />
      <TextCountExplain>
        영어, 숫자, 특수문자, 띄어쓰기 1바이트 / 엔터키 2바이트 / 한글 3바이트
        <br />
        모든 데이터는 이 브라우저에 저장되요. 유실 방지를 위해 꼭 백업해주세요.
      </TextCountExplain>
    </TextCountDiv>
  );
}

// 글 입력
function Text(props: { text: string; setText: Function }) {
  return (
    <TextDiv>
      <TextArea
        value={props.text}
        onChange={(e) => props.setText(e.target.value)}
      ></TextArea>
      <TextCount text={props.text} />
    </TextDiv>
  );
}

// 글 리스트
function WritingList(props: { load: Function }) {
  let data;
  try {
    data = Object.entries(
      JSON.parse(localStorage.getItem("saveData") || "{}")
    ).map((e: any) => {
      return (
        <Writing key={e[0]} onClick={() => props.load(e[0])}>
          {e[1].title || <span>제목 없음</span>}
        </Writing>
      );
    });
  } catch (err) {
    console.error(err);
    console.log(localStorage.getItem("saveData"));
    if (window.confirm("데이터가 잘못되었어요. 초기화하시겠어요?")) {
      localStorage.removeItem("saveData");
      window.location.reload();
    }
  }

  return (
    <SaveLoadDiv>
      <Btns></Btns>
      <Writings>{data}</Writings>
    </SaveLoadDiv>
  );
}

// 백업/복원
function Backup(props: { loadList: Function; save: Function }) {
  const backup = () => {
    props.save();
    console.log(localStorage.getItem("saveData"));
    navigator.clipboard.writeText(localStorage.getItem("saveData") || "{}");
    alert("백업 문자열을 클립보드에 복사했어요.");
  };

  const restore = () => {
    const data = prompt("백업 문자열을 입력해주세요.");
    try {
      if (data === "" || data === null) {
        alert("잘못된 문자열이에요");
        return;
      }

      JSON.parse(data);

      localStorage.setItem("saveData", data);
      window.location.reload();
    } catch (err) {
      alert("잘못된 문자열이에요");
      console.error(err);
    }
  };

  return (
    <BottomMenu>
      <Btns>
        <Btn2 onClick={backup}>백업</Btn2>
        <Btn2 onClick={restore}>복원(덮어쓰기)</Btn2>
        <Btn2 onClick={() => signOut(auth)}>로그아웃</Btn2>
      </Btns>
    </BottomMenu>
  );
}

function App() {
  const [id, setId] = useState(
    JSON.parse(localStorage.getItem("lastWriting") || "{}")?.id || uuidv4()
  );
  const [title, setTitle] = useState(
    JSON.parse(localStorage.getItem("lastWriting") || "{}")?.title
  );
  const [text, setText] = useState(
    JSON.parse(localStorage.getItem("lastWriting") || "{}")?.text
  );

  // 자동 저장
  useEffect(() => {
    localStorage.setItem(
      "lastWriting",
      JSON.stringify({ id, title, text, updated: new Date().toISOString() })
    );
  }, [id, title, text]);

  // 새로운 글 쓰기
  const newWriting = () => {
    const data = JSON.parse(localStorage.getItem("saveData") || "{}");
    data[id] = {
      title,
      text,
      updated: new Date().toISOString(),
    };
    localStorage.setItem("saveData", JSON.stringify(data));
    setId(uuidv4());
    setTitle("");
    setText("");
    loadList();
  };

  // 리스트 가져오기
  const loadList = useCallback(() => {
    Object.entries(JSON.parse(localStorage.getItem("saveData") || "{}")).map(
      (e: any) => {
        return {
          id: e[0],
          title: e[1].title,
          text: e[1].text,
          updated: e[1].updated,
        };
      }
    );
  }, []);

  // 초기화
  useEffect(() => {
    loadList();
  }, [loadList]);

  // 제목 수정
  const editTitle = (newTitle: string) => {
    const data = JSON.parse(localStorage.getItem("saveData") || "{}");
    data[id] = {
      title: newTitle,
      text,
      updated: new Date().toISOString(),
    };
    localStorage.setItem("saveData", JSON.stringify(data));
    setTitle(newTitle);
    loadList();
  };

  // 저장
  const save = () => {
    const data = JSON.parse(localStorage.getItem("saveData") || "{}");
    data[id] = {
      title: title,
      text: text,
      updated: new Date().toISOString(),
    };
    localStorage.setItem("saveData", JSON.stringify(data));
  };

  // 글 로드
  const load = (newId: string) => {
    // 현재 데이터 저장
    const data = JSON.parse(localStorage.getItem("saveData") || "{}");
    if (!title && !text) {
      delete data[id];
    } else {
      data[id] = {
        title: title,
        text: text,
        updated: new Date().toISOString(),
      };
    }
    localStorage.setItem("saveData", JSON.stringify(data));

    // 글 불러오기
    const newWriting = data?.[newId];
    localStorage.setItem(
      "lastWriting",
      JSON.stringify({
        newId,
        title: newWriting.title,
        text: newWriting.text,
        updated: new Date().toISOString(),
      })
    );
    setId(newId);
    setTitle(data?.[newId].title);
    setText(data?.[newId].text);
  };

  return (
    <Wrapper>
      <H1>
        <A
          href="https://github.com/HyunsDev/student-word-counter"
          target={"_blank"}
        >
          🧑‍🎓 학생부 / 자소서 글자수 계산기
        </A>
      </H1>
      <WritingList load={load} />
      <Backup save={save} loadList={loadList} />
      <Divver>
        <Title
          title={title}
          setTitle={setTitle}
          newWriting={newWriting}
          editTitle={editTitle}
        />
        <Text text={text} setText={setText} />
      </Divver>
    </Wrapper>
  );
}

export default App;
