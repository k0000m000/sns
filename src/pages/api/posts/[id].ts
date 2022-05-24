import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../../../sqlite";
import { Post } from "../../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post>
) {
  const { method } = req;
  const id = req.query.id as string;

  switch (method) {
    case "GET":
      db.fetchPost(id).then((post) =>
        post.id ? res.json(post) : res.status(404).end()
      );
      break;
    case "PUT":
      db.updatePost(id, req.body).then((id) =>
        id ? res.end() : res.status(404).end()
      );
      break;
    case "DELETE":
      db.removePost(id).then(() => res.end());
      break;
    default:
      res.status(405).end();
  }
}
