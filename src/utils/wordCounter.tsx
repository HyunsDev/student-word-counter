/* eslint-disable no-useless-escape */
export function wordCounter(content: string) {
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
