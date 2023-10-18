import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Typography,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import authOptions from "../api/auth/[...nextauth]";
import LoginForm from "@/components/LoginForm";

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-screen h-screen flex md:items-center md:justify-center">
      <div className="w-full md:w-[400px] text-center shadow-lg rounded-md py-7 px-4 md:px-10 lg:min-w-[600px] lg:min-h-[600px]">
        <div id="error">
          {error && (
            <Alert variant="ghost" color="red" className="mb-5">
              <Typography>{error}</Typography>
            </Alert>
          )}
        </div>

        {loading && (
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Spinner className="w-10 h-10" />
          </div>
        )}

        <div className="mb-4 md:mb-6">
          <Typography variant="h3">Log In</Typography>
          <Typography variant="paragraph" color="gray">
            Log in to your TSL Games account and enjoy uninterrupted gaming.
          </Typography>
        </div>

        <LoginForm />

        <div className="mt-4 md-:mt-6">
          <Typography variant="paragraph" color="gray">
            Don&apos;t have an account?{" "}
            <Link href="#">
              <span className="text-blue-500">Sign up</span>
            </Link>
          </Typography>
        </div>

        <div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="mb-4 mt-2">
              <Button
                onClick={() => signIn(provider.id)}
                color="blue"
                size="sm"
                className="font-bold rounded"
                disabled={loading}
              >
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
