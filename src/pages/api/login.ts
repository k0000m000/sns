import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../../sqlite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    db.fetchUser(req.body.id)
      .then((user) =>
        req.body.password === user.password
          ? res.status(200).end()
          : res.status(409).end()
      )
      .catch(() => res.status(500).end());
  } else {
    res.status(405).end();
  }
}
