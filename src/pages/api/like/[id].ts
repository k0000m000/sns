import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../sqlite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const id = req.query.id as string;
  if (method === "DELETE") {
    db.removeLike(id)
      .then(() => res.status(200).end())
      .catch(() => res.status(500).end());
  } else {
    res.status(405).end();
  }
}
