import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div
              className="p-4 rounded-2xl shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-hero)" }}
            >
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold">
            Sistema de Gerenciamento de Alunos
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie todos os dados dos seus alunos de forma simples, 
            segura e eficiente. CRUD completo com autenticação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-[var(--shadow-elegant)]"
              style={{ background: "var(--gradient-primary)" }}
              onClick={() => navigate("/auth")}
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              Fazer Login
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">CRUD Completo</h3>
            <p className="text-muted-foreground">
              Crie, visualize, edite e exclua registros de alunos com facilidade
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança</h3>
            <p className="text-muted-foreground">
              Autenticação robusta e proteção de dados com RLS
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Busca Rápida</h3>
            <p className="text-muted-foreground">
              Encontre alunos instantaneamente por nome ou matrícula
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
