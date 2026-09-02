import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "reshaped";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Field } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useLaudo, useCreateLaudo, useUpdateLaudo, type LaudoInput } from "./api";

type FormValues = {
  os: string;
  cliente: string;
  filial: string;
  emissor: string;
  dataLaudo: string;
  tipoLaudo: string;
  classeLaudo: string;
  dataMotorPeritado: string;
  dataMotorPronto: string;
  ensaioEletrico: string;
  ensaioTemperatura: string;
  ensaioVibracao: string;
  sintomas: string;
  falhaPrincipal: string;
  parecerTecnico: string;
  conclusao: string;
  observacao: string;
};

const EMPTY: FormValues = {
  os: "", cliente: "", filial: "", emissor: "", dataLaudo: "", tipoLaudo: "DPT", classeLaudo: "",
  dataMotorPeritado: "", dataMotorPronto: "", ensaioEletrico: "", ensaioTemperatura: "",
  ensaioVibracao: "", sintomas: "", falhaPrincipal: "", parecerTecnico: "", conclusao: "", observacao: "",
};

export function LaudoFormPage() {
  const { id } = useParams<{ id: string }>();
  const editing = !!id && id !== "novo";
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const existing = useLaudo(editing ? id : undefined);
  const create = useCreateLaudo();
  const update = useUpdateLaudo(id ?? "");

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ defaultValues: EMPTY });

  useEffect(() => {
    if (editing && existing.data) {
      const l = existing.data;
      reset({
        ...EMPTY,
        os: l.os ?? "", cliente: l.cliente ?? "", filial: l.filial ?? "", emissor: l.emissor ?? "",
        dataLaudo: l.dataLaudo?.slice(0, 10) ?? "", tipoLaudo: l.tipoLaudo ?? "DPT",
        classeLaudo: l.classeLaudo ?? "", dataMotorPeritado: l.dataMotorPeritado ?? "",
        dataMotorPronto: l.dataMotorPronto ?? "", ensaioEletrico: l.ensaioEletrico ?? "",
        ensaioTemperatura: l.ensaioTemperatura ?? "", ensaioVibracao: l.ensaioVibracao ?? "",
        sintomas: l.sintomas ?? "", falhaPrincipal: l.falhaPrincipal ?? "",
        parecerTecnico: l.parecerTecnico ?? "", conclusao: l.conclusao ?? "", observacao: l.observacao ?? "",
      });
    } else if (!editing) {
      reset({ ...EMPTY, emissor: user?.nome ?? "", filial: user?.filial ?? "" });
    }
  }, [editing, existing.data, reset, user]);

  async function onSubmit(v: FormValues) {
    const body: LaudoInput = {
      ...v,
      dataLaudo: v.dataLaudo ? new Date(v.dataLaudo).toISOString() : null,
    };
    try {
      if (editing) {
        await update.mutateAsync(body);
        navigate(`/dpt/laudo/${id}`, { replace: true });
      } else {
        const created = await create.mutateAsync(body);
        navigate(`/dpt/laudo/${created.id}`, { replace: true });
      }
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Falha ao salvar o laudo.");
    }
  }

  if (editing && existing.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton height={44} borderRadius="medium" />
        <Skeleton height={44} borderRadius="medium" />
        <Skeleton height={120} borderRadius="large" />
      </div>
    );
  }

  const busy = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-4">
      <h1 className="px-1 text-[20px] font-semibold tracking-tight text-foreground">
        {editing ? "Editar laudo" : "Novo laudo"}
      </h1>

      <div className="ios-list divide-y divide-border/70 p-3">
        <div className="pb-3">
          <Field label="OS *">
            <Input {...register("os", { required: true })} placeholder="Ex.: 45231-MED" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3">
          <Field label="Tipo">
            <Select {...register("tipoLaudo")}>
              <option value="DPT">DPT</option>
              <option value="TEC">TEC</option>
            </Select>
          </Field>
          <Field label="Classe">
            <Input {...register("classeLaudo")} placeholder="Inicial / Final…" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3">
          <Field label="Cliente">
            <Input {...register("cliente")} />
          </Field>
          <Field label="Filial">
            <Input {...register("filial")} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3">
          <Field label="Emissor">
            <Input {...register("emissor")} />
          </Field>
          <Field label="Data do laudo">
            <Input type="date" {...register("dataLaudo")} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3">
          <Field label="Motor peritado">
            <Input {...register("dataMotorPeritado")} />
          </Field>
          <Field label="Motor pronto">
            <Input {...register("dataMotorPronto")} />
          </Field>
        </div>
      </div>

      <div className="ios-list space-y-3 p-3">
        <Field label="Ensaio elétrico">
          <Input {...register("ensaioEletrico")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ensaio temperatura">
            <Input {...register("ensaioTemperatura")} />
          </Field>
          <Field label="Ensaio vibração">
            <Input {...register("ensaioVibracao")} />
          </Field>
        </div>
      </div>

      <div className="ios-list space-y-3 p-3">
        <Field label="Sintomas evidenciados">
          <Textarea {...register("sintomas")} rows={2} />
        </Field>
        <Field label="Falha principal">
          <Textarea {...register("falhaPrincipal")} rows={2} />
        </Field>
        <Field label="Parecer técnico">
          <Textarea {...register("parecerTecnico")} rows={3} />
        </Field>
        <Field label="Conclusão">
          <Textarea {...register("conclusao")} rows={3} />
        </Field>
        <Field label="Observação">
          <Textarea {...register("observacao")} rows={2} />
        </Field>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-2 border-t border-border bg-surface/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Button type="button" variant="neutral" block onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" block disabled={busy || !formState.isDirty}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {editing ? "Salvar" : "Criar laudo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
