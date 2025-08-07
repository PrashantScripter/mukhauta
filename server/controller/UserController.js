// controllers/userController.js

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Clerk } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const CreateUser = async (req, res) => {
  ClerkExpressRequireAuth(),
    async (req, res) => {
      try {
        const { userId } = req.auth;
        const clerkUser = await clerk.users.getUser(userId);

        // Check if exists
        const existing = await prisma.user.findUnique({
          where: { clerkUserId: clerkUser.id },
        });

        if (!existing) {
          // Create new record
          const newUser = await prisma.user.create({
            data: {
              clerkUserId: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
              imageUrl: clerkUser.profileImageUrl,
            },
          });
          console.log("Created new user:", newUser.id);
        } else {
          console.log("User already exists:", existing.id);
        }

        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    };
};

export default CreateUser;
