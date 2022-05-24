import { NextApiHandler } from "next";
import db from "../../../../sqlite";

import { Post, PostBaseData } from "../../../types/common";

export async function getPostsContents(idList: Array<string>) {
  return db.fetchPosts(idList);
}

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  if (method === "POST") {
    try {
      if (!req.body.post) {
        return res.status(400).end();
      }
      const post: PostBaseData = req.body.post;
      db.createPost(post).then(() => res.status(201).end());
    } catch (error) {
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
};
