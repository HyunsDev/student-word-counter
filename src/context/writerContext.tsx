import React, { createContext, useMemo, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Writer, writer } from "../lib/writing";

type WriterWriting = {
  id: string;
  title: string;
  text: string;
  memo: string;
};

export interface WriterContextProps {
  setWriting: (data: Partial<WriterWriting>) => void;
  writing: WriterWriting;

  isDebug: boolean;
  setDebug: (debug: boolean) => void;

  isShowMemo: boolean;
  setShowMemo: (show: boolean) => void;
}

export const WriterContext = createContext<WriterContextProps>({
  setWriting: () => null,
  writing: {
    id: uuidv4(),
    title: "",
    text: "",
    memo: "",
  },
  isDebug: false,
  setDebug: () => null,
  isShowMemo: true,
  setShowMemo: () => null,
});

function WriterContextProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState(writer.preLoad()?.id || uuidv4());
  const [title, setTitle] = useState(writer.preLoad()?.title || "");
  const [text, setText] = useState(writer.preLoad()?.text || "");
  const [memo, setMemo] = useState(writer.preLoad()?.memo || "");

  const [isShowMemo, setShowMemo] = useState(false);
  const [isDebug, setDebug] = useState(false);

  const value = useMemo(
    () => ({
      writing: {
        id,
        title,
        text,
        memo,
      },
      /**
       * 현재 Writer의 정보를 수정합니다. 특정 프로퍼티만 가진 데이터를 입력시 해당 프로퍼티만 수정됩니다.
       */
      setWriting(data: Partial<WriterWriting>) {
        if (data.id !== undefined) setId(data.id);
        if (data.title !== undefined) setTitle(data.title);
        if (data.text !== undefined) setText(data.text);
        if (data.memo !== undefined) setMemo(data.memo);
      },
      isDebug,
      setDebug,
      isShowMemo,
      setShowMemo,
    }),
    [id, title, text, memo, isDebug, isShowMemo]
  );

  return (
    <WriterContext.Provider value={value}>{children}</WriterContext.Provider>
  );
}

export default WriterContextProvider;
