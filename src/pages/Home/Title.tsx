import styled from "styled-components";

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

export default Title;
