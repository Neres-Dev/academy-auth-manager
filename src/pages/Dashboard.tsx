import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, GraduationCap } from "lucide-react";
import StudentList from "@/components/StudentList";
import StudentForm from "@/components/StudentForm";
import { User, Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/auth");
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Alunos</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciar Alunos</h2>
            <p className="text-muted-foreground">
              Cadastre, edite e gerencie os alunos do sistema
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="shadow-[var(--shadow-elegant)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        </div>

        {showForm ? (
          <StudentForm
            student={editingStudent}
            onClose={handleFormClose}
            userId={user.id}
          />
        ) : (
          <StudentList onEdit={handleEdit} userId={user.id} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;