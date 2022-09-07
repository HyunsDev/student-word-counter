import { useContext } from "react";
import { WriterContext } from "../context/writerContext";

function useWriter() {
  return useContext(WriterContext);
}
export default useWriter;
