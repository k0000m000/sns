import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../sqlite";

import { Like } from "../../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    try {
      if (!req.body.like) {
        return res.status(400).end();
      }
      const like: Like = req.body.like;
      db.createLike(like).then(() => res.status(201).end());
    } catch (error) {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
