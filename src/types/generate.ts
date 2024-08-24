export type GenerateResponseType =
  | {
      code: 200;
      data: { message: { article: string } };
    }
  | {
      code: 400 | 500;
      data: { message: string };
    };
