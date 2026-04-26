import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com autenticação
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Dosh
            </h1>
            <span className="text-4xl font-light tracking-tight text-accent">
              Flow
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Fluxo Inteligente
          </p>
          <p className="mt-6 text-sm text-foreground/80">
            Entre na sua conta
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-foreground/80">
                Email, CPF ou usuário
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="email, 000.000.000-00 ou usuário"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pr-10 h-11 bg-secondary/60"
                  required
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-20 h-11 bg-secondary/60"
                  required
                />
                <Lock className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              Entrar
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Não tem conta?{" "}
              <Link
                to="#"
                className="text-accent font-medium hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Dosh Flow. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
};

export default Login;
