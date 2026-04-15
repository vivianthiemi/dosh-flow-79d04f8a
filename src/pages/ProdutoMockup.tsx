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
  marca: "CAPLIFE",
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
                <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {produto.imagemUrl ? (
                    <img src={produto.imagemUrl} className="h-full w-full object-cover" />
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
                  <div
                    ref={mockupRef}
                    style={{ width: 1080, height: 1920, fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif" }}
                    className="flex flex-col"
                  >
                    {/* Top gradient accent bar */}
                    <div style={{ height: 6, background: "linear-gradient(90deg, #1B3A4A, #2D7A8A, #1B3A4A)" }} />

                    {/* Header */}
                    <div
                      style={{
                        background: "#FAFBFC",
                        borderBottom: "1px solid #E8ECF0",
                        padding: "28px 48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          color: "#1B2A4A",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {produto.marca}
                      </span>
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 600,
                          color: "#5A6B80",
                          letterSpacing: "0.02em",
                          textAlign: "right",
                          maxWidth: 600,
                        }}
                      >
                        {produto.nome.toUpperCase()}
                      </span>
                    </div>

                    {/* Product Image Area */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FFFFFF",
                        position: "relative",
                        minHeight: 950,
                      }}
                    >
                      {/* Subtle watermark pattern */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.03,
                          backgroundImage:
                            "repeating-linear-gradient(45deg, #1B2A4A 0, #1B2A4A 1px, transparent 1px, transparent 40px)",
                        }}
                      />
                      {produto.imagemUrl ? (
                        <img
                          src={produto.imagemUrl}
                          style={{
                            maxWidth: "85%",
                            maxHeight: "90%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 8px 32px rgba(27, 42, 74, 0.12))",
                            position: "relative",
                            zIndex: 1,
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 30, color: "#C8D0DA", fontWeight: 500, position: "relative", zIndex: 1 }}>
                          Imagem do Produto
                        </span>
                      )}
                    </div>

                    {/* Price Section */}
                    <div style={{ display: "flex", height: 180 }}>
                      <div
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg, #1B3A4A 0%, #2A5C6B 100%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.65)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                          }}
                        >
                          Custo
                        </span>
                        <span
                          style={{
                            fontSize: 52,
                            fontWeight: 800,
                            color: "#FFFFFF",
                            lineHeight: 1.1,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {formatCurrency(produto.precoCusto)}
                        </span>
                      </div>
                      <div
                        style={{
                          width: 2,
                          background: "rgba(255,255,255,0.15)",
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg, #1B2A4A 0%, #2A3D5C 100%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.65)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                          }}
                        >
                          Unidade
                        </span>
                        <span
                          style={{
                            fontSize: 52,
                            fontWeight: 800,
                            color: "#FFFFFF",
                            lineHeight: 1.1,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {formatCurrency(produto.precoUnidade)}
                        </span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div
                      style={{
                        padding: "32px 48px 40px",
                        background: "#FAFBFC",
                        borderTop: "1px solid #E8ECF0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#1B2A4A",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: 12,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        Benefícios
                      </p>
                      <div
                        style={{
                          fontSize: 20,
                          color: "#5A6B80",
                          whiteSpace: "pre-line",
                          lineHeight: 1.7,
                        }}
                      >
                        {produto.beneficios}
                      </div>
                    </div>

                    {/* Bottom accent bar */}
                    <div style={{ height: 6, background: "linear-gradient(90deg, #1B3A4A, #2D7A8A, #1B3A4A)" }} />
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base">
              <Download className="h-5 w-5 mr-2" />
              Baixar Imagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
