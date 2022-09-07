export type Writing = {
  id: string;
  title: string;
  text: string;
  memo: string;
  updated?: string;
  version: string;
};

// JSON 파서 에러
export class WritingParseError extends Error {
  public readonly name = "WritingParseError";

  constructor() {
    super("Save Data Parse Error");
  }
}

// Writer 추상 클래스
abstract class BaseWriter {
  abstract preSave(data: Writing): void;
  abstract preLoad(): Writing | undefined;
  abstract list(): { [key: string]: Omit<Writing, "id"> };
  abstract save(data: Writing): void;
  abstract load(id: string): Writing | undefined;
}

const parse = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (err) {
    throw new WritingParseError();
  }
};

const PRE_SAVE_KEY = "lastWriting";
const SAVE_KEY = "saveData";
const VERSION = "220901";

// Writer 클래스
export class Writer extends BaseWriter {
  // 저장 전 자동저장을 위해 임시로 저장
  preSave(data: Omit<Writing, "version">) {
    localStorage.setItem(
      "lastWriting",
      JSON.stringify({
        ...data,
        updated: new Date().toISOString(),
        version: VERSION,
      })
    );
  }

  // preSave로 저장된 데이터 불러오기
  preLoad(): Writing | undefined {
    const res = parse(PRE_SAVE_KEY);
    return res.id ? res : undefined;
  }

  // localStorage에 저장된 글 불러옴
  list(): { [key: string]: Omit<Writing, "id"> } {
    return parse(SAVE_KEY);
  }

  // LocalStorage에 저장
  save(data: Omit<Writing, "version">) {
    const oldData = parse(SAVE_KEY);
    oldData[data.id] = {
      title: data.title,
      text: data.text,
      memo: data?.memo || "",
      updated: new Date().toISOString(),
      version: VERSION,
    };
    localStorage.setItem("saveData", JSON.stringify(oldData));
  }

  // 글 불러오기
  load(id: string): Writing | undefined {
    const res = parse("saveData")?.[id];
    if (!res) return undefined;
    return {
      id: id,
      ...res,
    };
  }

  // 글 삭제
  remove(id: string) {
    const oldData = parse(SAVE_KEY);
    delete oldData[id];
    localStorage.setItem("saveData", JSON.stringify(oldData));
  }
}

export const writer = new Writer();
