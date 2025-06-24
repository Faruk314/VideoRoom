import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { UserTable } from "drizzle/schema/user";

async function getUser(userId: string) {
  const user = db.query.UserTable.findFirst({
    columns: {
      userId: true,
      userName: true,
      email: true,
      image: true,
    },
    where: eq(UserTable.userId, userId),
  });

  if (user == null) throw new Error("Failed to create user");

  return user;
}

async function insertUser(userData: {
  userName: string;
  email: string;
  hashedPassword: string;
  salt: string;
}) {
  const { userName, email, hashedPassword, salt } = userData;

  const [user] = await db
    .insert(UserTable)
    .values({
      userName,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({
      userId: UserTable.userId,
      userName: UserTable.userName,
      email: UserTable.email,
      image: UserTable.image,
    });

  if (user == null) throw new Error("Failed to insert user");

  return user;
}

export { getUser, insertUser };
