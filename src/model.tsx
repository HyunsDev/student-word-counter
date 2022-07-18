import { DocumentSnapshot, collection } from "firebase/firestore";

import { db } from "./firebase";
import z from "zod";

export class Document {
  id?: string;
  author: string;
  title?: string;
  content: string;

  constructor(
    id: string | undefined,
    author: string,
    title: string,
    content: string
  ) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.content = content;
  }

  static schema = z.object({
    author: z.string(),
    title: z.string(),
    content: z.string(),
  });

  static convertor = {
    toFirestore: (document: Document) => ({
      author: document.author,
      title: document.title,
      content: document.content,
    }),
    fromFirestore: (snapshot: DocumentSnapshot) => {
      const id = snapshot.id;
      const parsed = Document.schema.parse(snapshot.data());
      return new Document(id, parsed.author, parsed.title, parsed.content);
    },
  };
}

export const documentCollectionRef = collection(db, "document").withConverter(
  Document.convertor
);
