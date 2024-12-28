// src/pages/api/generateShoppingList.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Call OpenAI API to generate shopping list
  const shoppingList = ['Generated item 1', 'Generated item 2'] // Replace with actual API call

  res.status(200).json({ shoppingList })
}
