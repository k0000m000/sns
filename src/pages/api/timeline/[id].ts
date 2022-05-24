import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../../../sqlite";
import { Post } from "../../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Post>>
) {
  const { method } = req;
  const id = req.query.id as string;

  if (method === "GET") {
    db.fetchTimeline(id)
      .then((posts) => res.status(200).json(posts))
      .catch(() => res.status(500).end());
  } else {
    res.status(405).end();
  }
}
