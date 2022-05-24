import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../sqlite";

import { Follow } from "../../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    try {
      if (!req.body.follow) {
        return res.status(400).end();
      }
      const follow: Follow = req.body.follow;
      db.createFollow(follow).then(() => res.status(201).end());
    } catch (error) {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
