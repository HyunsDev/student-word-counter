import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, cv, Flex, Switch } from "opize-design-system";
import styled, { css } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { writer, Writing } from "./lib/writing";
import useWriter from "./hooks/useWriter";
import { clear } from "console";

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

const Head = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
`;

const H1 = styled.h1`
  font-size: 16px;
`;

const Developer = styled.p`
  font-size: 12px;
  color: ${cv.text3};
  margin-left: 26px;
`;

const A = styled.a`
  color: #000000;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
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

const MemoArea = styled.textarea`
  width: 100%;
  resize: vertical;
  border: solid 1px #cacaca;
  min-height: 100px;
  height: 10px;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TextCountExplain = styled.div`
  font-size: 14px;
  color: #9b9b9b;
  font-weight: normal;
`;

const WritingDiv = styled.div<{ isFocus: boolean; level: number }>`
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: 200ms;
  padding: 4px 8px;
  user-select: none;
  background-color: #ffffff;
  margin-left: ${(props) => (props.level - 1) * 8}px;
  &:hover {
    background-color: #ececec;
  }

  ${(props) =>
    props.isFocus &&
    css`
      background-color: #e9eaeb;
    `}

  span {
    color: #a3a3a3;
  }
`;

const BackupDiv = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

// 제목
function Title() {
  const { writing, setWriting, setShowMemo, isShowMemo } = useWriter();
  const ref = useRef<HTMLInputElement>(null);

  // 새로운 글 쓰기
  const newWriting = () => {
    if (!writing.title && !writing.text) {
      writer.remove(writing.id);
    } else {
      writer.save({
        ...writing,
        updated: new Date().toISOString(),
      });
    }
    const id = uuidv4();
    writer.save({
      id,
      text: "",
      title: "",
      memo: "",
      updated: new Date().toISOString(),
    });
    setWriting({
      id,
      title: "",
      text: "",
      memo: "",
    });
    ref.current?.focus();
  };

  // 제목 수정
  const editTitle = (newTitle: string) => {
    writer.save({
      ...writing,
      title: newTitle,
      updated: new Date().toISOString(),
    });
    setWriting({
      title: newTitle,
    });
  };

  return (
    <TitleDiv>
      <TitleInput
        ref={ref}
        value={writing.title}
        onChange={(e) => editTitle(e.target.value)}
        placeholder="제목 없음"
      />
      <Flex.Row gap="8px">
        <Button variant="contained" onClick={() => newWriting()}>
          새로운 글 만들기
        </Button>
      </Flex.Row>
    </TitleDiv>
  );
}

const RemoveBtn = styled.span`
  color: #f3c0c0;
  cursor: pointer;
  transition: 200ms;

  &:hover {
    color: #ff0000;
  }
`;

// 글자 수
function TextCount() {
  const { writing, setWriting, isDebug, isShowMemo, setShowMemo } = useWriter();
  const [res, setRes] = useState({
    noSpace: 0,
    withSpace: 0,
    byte: 0,
  });

  useEffect(() => {
    setRes(counter(writing.text));
  }, [writing.text]);

  const remove = () => {
    if (window.confirm("정말로 글을 삭제하시겠어요?")) {
      writer.remove(writing.id);
      const firstWritingId = Object.keys(writer.list())[0];
      if (firstWritingId) {
        const data = writer.load(firstWritingId);
        if (data) setWriting(data);
      } else {
        setWriting({
          id: uuidv4(),
          memo: "",
          text: "",
          title: "",
        });
      }
    }
  };

  return (
    <TextCountDiv>
      <Flex.Row>
        <Switch
          checked={isShowMemo}
          onChange={() => setShowMemo(!isShowMemo)}
          text="메모 표시"
        />
      </Flex.Row>
      <Flex.Column style={{ textAlign: "right" }}>
        공백 제외 {res.noSpace}자, 공백 포함 {res.withSpace}자, {res.byte}{" "}
        바이트
        <br />
        <TextCountExplain>
          영어, 숫자, 특수문자, 띄어쓰기 1바이트 / 엔터키 2바이트 / 한글 3바이트
          <br />
          모든 데이터는 이 브라우저에 저장되요. 유실 방지를 위해 꼭 백업해주세요
          <br />
          <RemoveBtn onClick={remove}>글 삭제</RemoveBtn>
          {isDebug && (
            <>
              <br />글 아이디: {writing.id}
              <br />
              마지막 수정 날짜:{" "}
              {new Date(
                writer.load(writing.id)?.updated || new Date()
              ).toLocaleString()}
            </>
          )}
        </TextCountExplain>
      </Flex.Column>
    </TextCountDiv>
  );
}

// 글 입력
function Text() {
  const { writing, setWriting, isShowMemo } = useWriter();

  // 자동 저장
  useEffect(() => {
    writer.preSave({ ...writing, updated: new Date().toISOString() });
  }, [writing]);

  return (
    <TextDiv>
      {isShowMemo && (
        <MemoArea
          value={writing.memo}
          onChange={(e) => setWriting({ memo: e.target.value })}
        ></MemoArea>
      )}
      <TextArea
        value={writing.text}
        onChange={(e) => setWriting({ text: e.target.value })}
      ></TextArea>
      <TextCount />
    </TextDiv>
  );
}

const StyledCategory = styled.div<{ level: number }>`
  font-size: 14px;
  color: #b4b4b4;
  font-weight: 600;
  margin-left: ${(props) => (props.level - 1) * 8 - 18}px;
  cursor: pointer;
  display: ${(props) => (props.level === 0 ? "none" : "flex")};
  align-items: center;
  user-select: none;
  gap: 4px;
  transition: 200ms;
  padding: 4px 0px;

  & > svg {
    transition: 200ms;
  }
`;

function Category({
  category,
  children,
  level,
}: {
  category: string;
  children: React.ReactNode;
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Flex.Column gap="2px">
      <StyledCategory level={level} onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#b4b4b4"
          viewBox="0 0 256 256"
          style={{ transform: `rotate(${isOpen ? 0 : -180}deg)` }}
        >
          <rect width="256" height="256" fill="none"></rect>
          <polyline
            points="208 96 128 176 48 96"
            fill="none"
            stroke="#b4b4b4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="20"
          ></polyline>
        </svg>
        {category}
      </StyledCategory>

      {isOpen && children}
    </Flex.Column>
  );
}

const ListDiv = styled.div`
  position: fixed;
  left: 32px;
  top: 80px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 글 리스트
function WritingList() {
  const { writing, setWriting } = useWriter();
  const [list, setList] = useState<React.ReactNode>(<></>);

  const load = useCallback(
    (key: string) => {
      if (!writing.title && !writing.text) {
        writer.remove(writing.id);
      } else {
        writer.save(writing);
      }
      const data = writer.load(key);
      if (data) setWriting(data);
    },
    [setWriting, writing]
  );

  useEffect(() => {
    interface recursionMap {
      _list?: string[];
      [key: string]: any;
    }
    const map: recursionMap = {
      _list: [],
    };

    // 글 리스트
    const writingList = writer.list();

    // 맵
    Object.entries(writingList).forEach(([key, data]) => {
      const title: string[] = data.title.split("/");

      let cursor: any = map;
      for (const deps of title) {
        if (deps === title[title.length - 1]) {
          if (cursor?._list) {
            cursor._list.push(key);
          } else {
            cursor._list = [deps];
          }
        } else {
          cursor[deps] = cursor[deps] || { _list: [] };
          cursor = cursor[deps];
        }
      }
    });

    // 직렬화
    const recursion = (
      _map = map,
      deps = 0,
      category: string = ""
    ): React.ReactNode => {
      if (deps >= 10) {
        console.log("깊이 초과", deps);
        return [];
      }

      let _list: {
        id: string;
        title: string;
        updated: string;
        level: number;
      }[] = [];
      // 리스트
      if (_map._list) {
        _list = _map._list.map((key) => ({
          id: key,
          title:
            writingList[key].title.split("/")[
              writingList[key].title.split("/").length - 1
            ],
          level: deps,
          text: writingList[key].text,
          updated: writingList[key].text,
        }));
      }

      let child: React.ReactNode[] = [];
      // 카테고리
      Object.keys(_map)
        .filter((e) => e !== "_list")
        .forEach((key) => {
          child.push(recursion(_map[key], deps + 1, key));
        });

      return (
        <Category category={category} level={deps}>
          {_list.map((e) => (
            <WritingDiv
              key={e.id}
              level={e.level}
              onClick={() => load(e.id)}
              isFocus={e.id === writing.id}
            >
              {e.title || <span>제목 없음</span>}
            </WritingDiv>
          ))}
          {child}
        </Category>
      );
    };

    const res = recursion();
    setList(res);
  }, [load, writing.id, writing.title]);

  try {
  } catch (err) {
    console.error(err);
    console.log(localStorage.getItem("saveData"));
    if (window.confirm("데이터가 잘못되었어요. 초기화하시겠어요?")) {
      localStorage.removeItem("saveData");
      window.location.reload();
    }
  }

  return <ListDiv>{list}</ListDiv>;
}

const DebugMenu = styled.div<{ isDebug: boolean }>`
  opacity: ${(props) => (props.isDebug ? "1" : "0")};
  transition: 200ms;

  &:hover {
    opacity: 1;
  }
`;

// 백업/복원
function Backup() {
  const { writing, setWriting, isDebug, setDebug } = useWriter();

  const backup = () => {
    writer.save({
      ...writing,
    });
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
      setWriting({
        id: uuidv4(),
        text: "",
        title: "",
      });
      localStorage.setItem("saveData", data);
      window.location.reload();
    } catch (err) {
      alert("잘못된 문자열이에요");
      console.error(err);
    }
  };

  return (
    <BackupDiv>
      <Flex.Column gap="8px">
        <DebugMenu isDebug={isDebug}>
          <Switch
            text="디버그 모드"
            checked={isDebug}
            onChange={() => setDebug(!isDebug)}
          />
        </DebugMenu>
        <Flex.Row gap="8px">
          <Button variant="outlined" onClick={backup}>
            백업
          </Button>
          <Button variant="outlined" onClick={restore}>
            복원(덮어쓰기)
          </Button>
        </Flex.Row>
      </Flex.Column>
    </BackupDiv>
  );
}

function App() {
  return (
    <Wrapper>
      <Head>
        <H1>
          <A
            href="https://github.com/HyunsDev/student-word-counter"
            target={"_blank"}
          >
            🧑‍🎓 학생부 / 자소서 글자수 계산기
          </A>
        </H1>
        <Developer>개발자 혀느현스</Developer>
      </Head>

      <WritingList />
      <Backup />
      <Divver>
        <Title />
        <Text />
      </Divver>
    </Wrapper>
  );
}

export default App;
