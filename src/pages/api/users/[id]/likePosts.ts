import type { NextApiHandler } from "next";

import db from "../../../../../sqlite";
import { getUser } from "./";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  const id = req.query.id as string;
  if (method === "GET") {
    try {
      const user = await getUser(id);
      if (!user) {
        return res.status(404).end();
      }
      db.fetchPosts(user.likePosts).then((posts) =>
        res.status(200).json(posts)
      );
    } catch {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
};

export default handler;
