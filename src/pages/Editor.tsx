import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Document, documentCollectionRef } from "../model";
import {
  DocumentReference,
  addDoc,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { User, signOut } from "firebase/auth";

import { auth } from "../firebase";
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
  document: Document | null;
  updateTitle: (title: string) => Promise<void>;
  createDocument: () => Promise<DocumentReference<Document>>;
}) {
  return (
    <TitleDiv>
      <TitleInput
        value={props.document?.title ?? ""}
        onChange={(e) => props.updateTitle(e.target.value)}
        placeholder="제목 없음"
      />
      <Btn onClick={() => props.createDocument()}>새로운 글 만들기</Btn>
    </TitleDiv>
  );
}

// 글자 수
function TextCount(props: { document: Document | null }) {
  const [res, setRes] = useState({
    noSpace: 0,
    withSpace: 0,
    byte: 0,
  });

  useEffect(() => {
    setRes(counter(props.document?.content ?? ""));
  }, [props.document]);

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
  document: Document | null;
  updateContent: (content: string) => Promise<void>;
}) {
  return (
    <TextDiv>
      <TextArea
        value={props.document?.content ?? ""}
        onChange={(e) => props.updateContent(e.target.value)}
      ></TextArea>
      <TextCount document={props.document} />
    </TextDiv>
  );
}

// 글 리스트
function WritingList(props: {
  documents: Document[];
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <SaveLoadDiv>
      <Btns></Btns>
      <Writings>
        {props.documents.map((document) => (
          <Writing
            key={document.id}
            onClick={() => props.setSelectedId(document.id ?? null)}
          >
            {document.title || "제목 없음"}
          </Writing>
        ))}
      </Writings>
    </SaveLoadDiv>
  );
}

// 백업/복원
function Backup() {
  return (
    <BottomMenu>
      <Btns>
        <Btn2 onClick={() => signOut(auth)}>로그아웃</Btn2>
      </Btns>
    </BottomMenu>
  );
}

type EditorProps = {
  user: User;
};

function Editor({ user }: EditorProps) {
  const documentQuery = useMemo(
    () =>
      query(documentCollectionRef, where("author", "==", user.uid), limit(30)),
    [user]
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentDocument = useMemo(
    () => documents.find((document) => document.id === selectedId) ?? null,
    [documents, selectedId]
  );
  const currentDocumentRef = useMemo(
    () => (selectedId ? doc(documentCollectionRef, selectedId) : null),
    [selectedId]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(documentQuery, (snapshot) => {
      setDocuments(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [documentQuery]);

  const createDocument = async () => {
    const docRef = await addDoc(documentCollectionRef, {
      author: user.uid,
      title: "",
      content: "",
    });
    setSelectedId(docRef.id);
    return docRef;
  };

  const updateTitle = async (title: string) => {
    const docRef = currentDocumentRef ?? (await createDocument());
    updateDoc(docRef, { title });
  };
  const updateContent = async (content: string) => {
    const docRef = currentDocumentRef ?? (await createDocument());
    updateDoc(docRef, { content });
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
      <WritingList documents={documents} setSelectedId={setSelectedId} />
      <Backup />
      <Divver>
        <Title
          document={currentDocument}
          updateTitle={updateTitle}
          createDocument={createDocument}
        />
        <Text document={currentDocument} updateContent={updateContent} />
      </Divver>
    </Wrapper>
  );
}

export default Editor;
