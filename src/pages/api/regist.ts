import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../sqlite";

import { User, UserBaseData } from "../../types/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    try {
      if (!req.body.user) {
        return res.status(400).end();
      }
      const user: UserBaseData = req.body.user;
      const userForCheckIsExist: User = await db.fetchUser(user.id);
      if (userForCheckIsExist.id) {
        return res.status(409).end();
      }
      db.createUser(user).then(() => res.status(201).end());
    } catch {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
