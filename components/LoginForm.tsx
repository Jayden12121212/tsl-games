import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (response?.error) {
      setError(response?.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Input
        crossOrigin=""
        label="Your Email *"
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <Input
        crossOrigin=""
        label="Your Password *"
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Submit"}
      </Button>
    </form>
  );
};

export default LoginForm;
