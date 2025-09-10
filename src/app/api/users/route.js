/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */
export async function GET() {
  const users = [
    { id: 1, name: "Amit Sharma", role: "Admin" },
    { id: 2, name: "Priya Singh", role: "Editor" },
    { id: 3, name: "Rohan Verma", role: "Viewer" },
  ];

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
