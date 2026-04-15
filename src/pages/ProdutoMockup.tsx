import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ImagePlus, Package } from "lucide-react";
import html2canvas from "html2canvas";

interface ProdutoData {
  marca: string;
  nome: string;
  codigo: string;
  qtdBox: string;
  unidade: string;
  peso: string;
  unidadePeso: string;
  precoCusto: string;
  precoUnidade: string;
  beneficios: string;
  imagemUrl: string | null;
}

const defaultProduto: ProdutoData = {
  marca: "Caplife",
  nome: "Body Scrub 412 VIP Rose",
  codigo: "L-28",
  qtdBox: "24",
  unidade: "un",
  peso: "300",
  unidadePeso: "g",
  precoCusto: "5.61",
  precoUnidade: "7.29",
  beneficios: "• Contém 300 g",
  imagemUrl: null,
};

const formatCurrency = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function ProdutoMockup() {
  const [produto, setProduto] = useState<ProdutoData>(defaultProduto);
  const mockupRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ProdutoData, value: string) => {
    setProduto((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProduto((prev) => ({ ...prev, imagemUrl: url }));
    }
  };

  const handleDownload = async () => {
    if (!mockupRef.current) return;
    const canvas = await html2canvas(mockupRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      width: 1080,
      height: 1920,
    });
    const link = document.createElement("a");
    link.download = `${produto.nome || "produto"}-mockup.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mockup de Produto</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold">Editar Produto</h2>

            {/* Image Upload */}
            <div>
              <Label>Imagem</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center">
                  {produto.imagemUrl ? (
                    <img src={produto.imagemUrl} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                    <ImagePlus className="h-4 w-4" />
                    Adicionar imagem
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <span className="text-xs text-muted-foreground">JPG, PNG ou WEBP · máx 5 MB</span>
              </div>
            </div>

            <div>
              <Label>Marca</Label>
              <Input className="mt-1.5" value={produto.marca} onChange={(e) => handleChange("marca", e.target.value)} />
            </div>

            <div>
              <Label>Nome do Produto *</Label>
              <Input className="mt-1.5" value={produto.nome} onChange={(e) => handleChange("nome", e.target.value)} />
            </div>

            <div>
              <Label>Código (ref.)</Label>
              <Input className="mt-1.5" placeholder="ex: L-28" value={produto.codigo} onChange={(e) => handleChange("codigo", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantidade no Box</Label>
                <Input className="mt-1.5" placeholder="ex: 24" value={produto.qtdBox} onChange={(e) => handleChange("qtdBox", e.target.value)} />
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={produto.unidade} onValueChange={(v) => handleChange("unidade", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">un</SelectItem>
                    <SelectItem value="cx">cx</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lt">lt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Peso</Label>
                <Input className="mt-1.5" value={produto.peso} onChange={(e) => handleChange("peso", e.target.value)} />
              </div>
              <div>
                <Label>Unidade de peso</Label>
                <Select value={produto.unidadePeso} onValueChange={(v) => handleChange("unidadePeso", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="lt">lt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Preço de Custo *</Label>
                <Input className="mt-1.5" value={produto.precoCusto} onChange={(e) => handleChange("precoCusto", e.target.value)} />
              </div>
              <div>
                <Label>Preço Unitário *</Label>
                <Input className="mt-1.5" value={produto.precoUnidade} onChange={(e) => handleChange("precoUnidade", e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Benefícios</Label>
              <Textarea className="mt-1.5" rows={3} value={produto.beneficios} onChange={(e) => handleChange("beneficios", e.target.value)} />
            </div>
          </Card>

          {/* Preview */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pré-visualização</p>

            {/* Scaled preview */}
            <div className="relative w-full overflow-hidden rounded-xl border bg-background" style={{ paddingBottom: `${(1920 / 1080) * 100}%` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ transform: "scale(0.35)", transformOrigin: "top center", position: "absolute", top: 0 }}>
                  {/* Actual 1080x1920 mockup */}
                  <div ref={mockupRef} style={{ width: 1080, height: 1920 }} className="bg-white flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-12 py-8 border-b-2 border-gray-100">
                      <span className="text-[28px] font-black tracking-wide text-gray-900 uppercase">{produto.marca}</span>
                      <span className="text-[24px] font-semibold text-gray-500 uppercase tracking-wide">{produto.nome}</span>
                    </div>

                    {/* Product Image */}
                    <div className="flex-1 flex items-center justify-center bg-gray-50 relative" style={{ minHeight: 900 }}>
                      {produto.imagemUrl ? (
                        <img src={produto.imagemUrl} className="max-w-full max-h-full object-contain p-8" />
                      ) : (
                        <span className="text-[32px] text-gray-300">Imagem do Produto</span>
                      )}
                    </div>

                    {/* Price Bar */}
                    <div className="flex">
                      <div className="flex-1 bg-[#8B1A8B] flex flex-col items-center justify-center py-8">
                        <span className="text-[20px] font-bold text-white/80 uppercase tracking-widest">Custo:</span>
                        <span className="text-[56px] font-black text-white leading-tight">{formatCurrency(produto.precoCusto)}</span>
                      </div>
                      <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center py-8">
                        <span className="text-[20px] font-bold text-white/80 uppercase tracking-widest">Unidade:</span>
                        <span className="text-[56px] font-black text-white leading-tight">{formatCurrency(produto.precoUnidade)}</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="px-12 py-10 bg-white">
                      <p className="text-[24px] font-black text-gray-900 uppercase tracking-wide mb-3">Benefícios:</p>
                      <div className="text-[22px] text-gray-700 whitespace-pre-line leading-relaxed">{produto.beneficios}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleDownload} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 text-base">
              <Download className="h-5 w-5 mr-2" />
              Baixar Imagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
