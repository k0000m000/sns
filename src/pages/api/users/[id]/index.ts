import type { NextApiHandler } from "next";

import db from "../../../../../sqlite";

export async function getUser(id: string) {
  return db.fetchUser(id);
}

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  const id = req.query.id as string;
  try {
    switch (method) {
      case "GET":
        getUser(id).then((user) =>
          user ? res.json(user) : res.status(404).end()
        );
        break;
      case "PUT":
        db.updateUser(id, req.body).then((id) =>
          id ? res.end() : res.status(404).end()
        );
        break;
      case "DELETE":
        db.removeUser(id).then(() => res.end());
        break;
      default:
        res.status(405).end();
    }
  } catch {
    res.status(500).end();
  }
};

export default handler;
