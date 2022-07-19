import TextCount from "./TextCount";
import styled from "styled-components";

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

type TextProps = {
  content: string;
  setContent: (content: string) => void;
  disabled: boolean;
};

// 글 입력
function Text({ content, setContent, disabled }: TextProps) {
  return (
    <TextDiv>
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
      ></TextArea>
      <TextCount content={content} />
    </TextDiv>
  );
}

export default Text;
