import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      authorize: async (credentials) => {
        const user = await db.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          // User with the provided email was not found
          return null;
        }

        // Compare the hashed password with the provided password using bcrypt
        const passwordMatches = credentials?.password
          ? await bcrypt.compare(credentials.password, user?.hashedPassword!)
          : false;

        if (!passwordMatches) {
          // Invalid password
          return null;
        }

        // Successfully authenticated user
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      // You can implement your JWT logic here
      return token;
    },
    redirect() {
      return "/";
    },
  },
};

export default NextAuth(authOptions);
