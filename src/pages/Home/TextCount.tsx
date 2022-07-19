import { useEffect, useState } from "react";

import styled from "styled-components";
import { wordCounter } from "../../utils/wordCounter";

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

// 글자 수
function TextCount(props: { content: string }) {
  const [res, setRes] = useState({
    noSpace: 0,
    withSpace: 0,
    byte: 0,
  });

  useEffect(() => {
    setRes(wordCounter(props.content));
  }, [props.content]);

  return (
    <TextCountDiv>
      공백 제외 {res.noSpace}자, 공백 포함 {res.withSpace}자, {res.byte} 바이트
      <br />
      <TextCountExplain>
        영어, 숫자, 특수문자, 띄어쓰기 1바이트 / 엔터키 2바이트 / 한글 3바이트
      </TextCountExplain>
    </TextCountDiv>
  );
}

export default TextCount;
