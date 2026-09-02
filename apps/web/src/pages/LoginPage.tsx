import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { UserSession } from "@medro/shared";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuth((s) => s.setSession);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const login = useMutation({
    mutationFn: () =>
      api<{ token: string; user: UserSession }>("/auth/login", {
        method: "POST",
        body: { usuario, senha },
      }),
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      navigate("/", { replace: true });
    },
  });

  const devLogin = useMutation({
    mutationFn: () =>
      api<{ token: string; user: UserSession }>("/auth/dev-login", {
        method: "POST",
        body: { usuario: usuario || "douglasnou" },
      }),
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      navigate("/", { replace: true });
    },
  });

  return (
    <div className="flex min-h-dvh items-center justify-center bg-elevated-dark p-6">
      <Card className="w-full max-w-sm space-y-5 rounded-xl p-6 shadow-ios-2">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Medro</h1>
          <p className="text-[13px] text-muted-foreground">Kairós Motores</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate();
          }}
        >
          <Field label="Usuário">
            <Input
              autoCapitalize="none"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </Field>
          <Field
            label="Senha"
            error={
              login.isError
                ? login.error instanceof ApiError && login.error.status === 401
                  ? "Usuário ou senha inválidos, ou acesso inativo."
                  : "Não foi possível entrar agora. Tente novamente."
                : undefined
            }
          >
            <Input
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" block size="lg" disabled={login.isPending}>
            {login.isPending ? "Entrando…" : "Entrar"}
          </Button>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => devLogin.mutate()}
              disabled={devLogin.isPending}
              className="w-full text-center text-[12px] text-muted-foreground underline-offset-2 hover:underline"
            >
              {devLogin.isPending
                ? "…"
                : `entrar sem senha (dev) como “${usuario || "douglasnou"}”`}
            </button>
          )}
        </form>
      </Card>
    </div>
  );
}
