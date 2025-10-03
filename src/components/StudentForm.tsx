import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

const studentSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  registration_number: z.string().min(1, "Matrícula é obrigatória").max(50),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20),
});

interface StudentFormProps {
  student?: any;
  onClose: () => void;
  userId: string;
}

const StudentForm = ({ student, onClose, userId }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    full_name: "",
    registration_number: "",
    cpf: "",
    birth_date: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name,
        registration_number: student.registration_number,
        cpf: student.cpf,
        birth_date: student.birth_date,
        email: student.email,
        phone: student.phone,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      studentSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        user_id: userId,
      };

      if (student) {
        const { error } = await supabase
          .from("students")
          .update(dataToSubmit)
          .eq("id", student.id);

        if (error) throw error;

        toast({
          title: "Aluno atualizado!",
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("students")
          .insert([dataToSubmit]);

        if (error) throw error;

        toast({
          title: "Aluno cadastrado!",
          description: "O aluno foi adicionado com sucesso.",
        });
      }

      onClose();
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes("duplicate key")) {
        if (error.message.includes("registration_number")) {
          errorMessage = "Esta matrícula já está cadastrada.";
        } else if (error.message.includes("cpf")) {
          errorMessage = "Este CPF já está cadastrado.";
        }
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="shadow-[var(--shadow-elegant)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl">
            {student ? "Editar Aluno" : "Novo Aluno"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_number">Matrícula *</Label>
              <Input
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF (somente números) *</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="12345678901"
                required
                disabled={loading}
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento *</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="11987654321"
                required
                disabled={loading}
                maxLength={20}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : student ? (
                "Atualizar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;