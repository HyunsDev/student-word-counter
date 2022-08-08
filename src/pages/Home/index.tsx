import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Document, documentCollectionRef } from "../../model";
import { User, signOut } from "firebase/auth";
import {
  addDoc,
  doc,
  limit,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import Editor from "./Editor";
import { auth } from "../../firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

// 글 리스트
function WritingList(props: {
  documents: Document[];
  setSelectedId: Dispatch<SetStateAction<string | undefined>>;
}) {
  return (
    <SaveLoadDiv>
      <Btns></Btns>
      <Writings>
        {props.documents.map((document) => (
          <Writing
            key={document.id}
            onClick={() => props.setSelectedId(document.id)}
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

type HomeProps = {
  user: User;
};

function Home({ user }: HomeProps) {
  const documentQuery = useMemo(
    () =>
      query(documentCollectionRef, where("author", "==", user.uid), limit(30)),
    [user]
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onSnapshot(documentQuery, (snapshot) => {
      setDocuments(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [documentQuery]);

  const syncDatabase = useCallback(
    async (id: string | undefined, title: string, content: string) => {
      const document = new Document(id, user.uid, title, content);
      if (id) {
        const docRef = doc(documentCollectionRef, id);
        await setDoc(docRef, document);
      } else {
        const docRef = await addDoc(documentCollectionRef, document);
        setSelectedId(docRef.id);
      }
    },
    [user.uid]
  );

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
      <Editor selectedId={selectedId} syncDatabase={syncDatabase} />
    </Wrapper>
  );
}

export default Home;
