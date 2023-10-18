import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { Session } from "next-auth";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

type HomeProps = {
  session: Session | null;
};

const Home = ({ session }: HomeProps) => {
  return (
    <div>
      {session ? (
        <div>
          <Typography variant="h3">Welcome, {session.user.name}</Typography>
          <Button onClick={() => signOut()}>Log out</Button>
        </div>
      ) : (
        <div>
          <Typography variant="h3">Welcome to our website</Typography>
          <Button onClick={() => signIn()}>Log in</Button>
        </div>
      )}
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: { session },
  };
};
