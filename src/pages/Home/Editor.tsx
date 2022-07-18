import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { documentCollectionRef } from "../../model";
import styled from "styled-components";

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

const Divver = styled.div`
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Btn = styled.button`
  padding: 4px 8px;
  background-color: #000000;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
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

// 제목
function Title(props: {
  title: string;
  setTitle: (title: string) => void;
  disabled: boolean;
  syncDatabase: (
    id: string | undefined,
    title: string,
    content: string
  ) => Promise<void>;
}) {
  return (
    <TitleDiv>
      <TitleInput
        value={props.title}
        disabled={props.disabled}
        onChange={(e) => props.setTitle(e.target.value)}
        placeholder="제목 없음"
      />
      <Btn onClick={() => props.syncDatabase(undefined, "", "")}>
        새로운 글 만들기
      </Btn>
    </TitleDiv>
  );
}

// 글자 수
function TextCount(props: { content: string }) {
  const [res, setRes] = useState({
    noSpace: 0,
    withSpace: 0,
    byte: 0,
  });

  useEffect(() => {
    setRes(counter(props.content));
  }, [props.content]);

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
function Text(props: {
  content: string;
  setContent: (content: string) => void;
  disabled: boolean;
}) {
  return (
    <TextDiv>
      <TextArea
        value={props.content}
        onChange={(e) => props.setContent(e.target.value)}
        disabled={props.disabled}
      ></TextArea>
      <TextCount content={props.content} />
    </TextDiv>
  );
}

type EditorProps = {
  selectedId: string | undefined;
  syncDatabase: (
    id: string | undefined,
    title: string,
    content: string
  ) => Promise<void>;
};

type EditorState =
  | {
      type: "loading";
    }
  | {
      type: "editing";
      title: string;
      content: string;
    }
  | {
      type: "error";
      error: string;
    };

function Editor({ selectedId, syncDatabase }: EditorProps) {
  const [state, setState] = useState<EditorState>({
    type: "loading",
  });

  const setTitle = (title: string) => {
    if (state.type !== "editing") return;
    setState((original) => ({
      ...original,
      title,
    }));
    syncDatabase(selectedId, title, state.content);
  };

  const setContent = (content: string) => {
    if (state.type !== "editing") return;
    setState((original) => ({
      ...original,
      content,
    }));
    syncDatabase(selectedId, state.title, content);
  };

  useEffect(() => {
    (async () => {
      const serverData =
        selectedId === undefined
          ? undefined
          : (await getDoc(doc(documentCollectionRef, selectedId))).data();
      setState({
        type: "editing",
        title: serverData?.title ?? "",
        content: serverData?.content ?? "",
      });
    })();
  }, [selectedId]);

  return (
    <Divver>
      <Title
        title={state.type === "editing" ? state.title : ""}
        disabled={state.type !== "editing"}
        setTitle={setTitle}
        syncDatabase={syncDatabase}
      />
      <Text
        content={state.type === "editing" ? state.content : ""}
        disabled={state.type !== "editing"}
        setContent={setContent}
      />
    </Divver>
  );
}

export default Editor;
