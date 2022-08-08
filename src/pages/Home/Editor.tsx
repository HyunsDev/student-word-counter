import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import Text from "./Text";
import Title from "./Title";
import { documentCollectionRef } from "../../model";
import styled from "styled-components";

const Divver = styled.div`
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

  const initializeWithServerData = useCallback(async () => {
    const serverData =
      selectedId === undefined
        ? undefined
        : (await getDoc(doc(documentCollectionRef, selectedId))).data();
    setState({
      type: "editing",
      title: serverData?.title ?? "",
      content: serverData?.content ?? "",
    });
  }, [selectedId]);

  const listenToChangesFromServer = useCallback(
    (id: string, onChange: () => void) => {
      let initialSnapshot = true;
      const unsubscribe = onSnapshot(
        doc(documentCollectionRef, id),
        (snapshot) => {
          const isFromServer = !snapshot.metadata.hasPendingWrites;
          // Initial snapshot always comes from the server.
          if (initialSnapshot) {
            initialSnapshot = false;
            return;
          }
          if (isFromServer) {
            onChange();
          }
        }
      );
      return unsubscribe;
    },
    []
  );

  useEffect(() => {
    initializeWithServerData();
  }, [initializeWithServerData]);

  useEffect(() => {
    if (selectedId !== undefined) {
      const unsubscribe = listenToChangesFromServer(selectedId, () =>
        setState({
          type: "error",
          error:
            "다른 기기에서 편집중입니다. 이 기기에서 계속하려면 새로고침 해주세요.",
        })
      );

      return () => unsubscribe();
    }
  }, [listenToChangesFromServer, selectedId]);

  return (
    <Divver>
      {state.type === "error" ? (
        <ErrorMessageContainer>
          <span>
            <b>알림</b>-{state.error}
          </span>
        </ErrorMessageContainer>
      ) : (
        <>
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
        </>
      )}
    </Divver>
  );
}

export default Editor;
