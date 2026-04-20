import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBag, Search, MapPin, Store, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}
interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
}
interface CartItem {
  product: Product;
  qty: number;
}

const DELIVERY_FEE = 8.0;

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Informe seu nome").max(100),
  customer_phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20, "Telefone inválido"),
  fulfillment_type: z.enum(["delivery", "pickup"]),
  payment_method: z.enum(["pix", "dinheiro", "cartao_credito", "cartao_debito"]),
  address_street: z.string().trim().max(200).optional().or(z.literal("")),
  address_number: z.string().trim().max(20).optional().or(z.literal("")),
  address_complement: z.string().trim().max(100).optional().or(z.literal("")),
  address_neighborhood: z.string().trim().max(100).optional().or(z.literal("")),
  address_city: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export default function Loja() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ id: string; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    fulfillment_type: "delivery" as "delivery" | "pickup",
    payment_method: "pix" as "pix" | "dinheiro" | "cartao_credito" | "cartao_debito",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_city: "",
    notes: "",
  });

  useEffect(() => {
    document.title = "Cardápio Online — Faça seu pedido";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Peça online com retirada ou entrega. Cardápio completo com fotos e preços.");
  }, []);

  useEffect(() => {
    const load = async () => {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").eq("available", true).order("sort_order"),
      ]);
      if (catsRes.data) {
        setCategories(catsRes.data);
        if (catsRes.data[0]) setActiveCat(catsRes.data[0].id);
      }
      if (prodsRes.data) setProducts(prodsRes.data as Product[]);
      setLoading(false);
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q),
    );
  }, [products, search]);

  const productsByCat = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const c of categories) map[c.id] = [];
    for (const p of filteredProducts) {
      if (p.category_id && map[p.category_id]) map[p.category_id].push(p);
    }
    return map;
  }, [filteredProducts, categories]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.qty * Number(i.product.price), 0);
  const deliveryFee = form.fulfillment_type === "delivery" && cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === p.id);
      if (ex) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product: p, qty: 1 }];
    });
    toast({ title: "Adicionado ao carrinho", description: p.name });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const scrollToCat = (id: string) => {
    setActiveCat(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitOrder = async () => {
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast({ title: "Verifique os dados", description: first.message, variant: "destructive" });
      return;
    }
    if (form.fulfillment_type === "delivery") {
      if (!form.address_street || !form.address_number || !form.address_neighborhood) {
        toast({
          title: "Endereço incompleto",
          description: "Informe rua, número e bairro para entrega",
          variant: "destructive",
        });
        return;
      }
    }
    if (cart.length === 0) {
      toast({ title: "Carrinho vazio", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const items = cart.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      qty: i.qty,
      unit_price: Number(i.product.price),
      total: Number(i.product.price) * i.qty,
    }));

    const payload = {
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      fulfillment_type: form.fulfillment_type,
      payment_method: form.payment_method,
      address_street: form.fulfillment_type === "delivery" ? form.address_street : null,
      address_number: form.fulfillment_type === "delivery" ? form.address_number : null,
      address_complement: form.fulfillment_type === "delivery" ? form.address_complement : null,
      address_neighborhood: form.fulfillment_type === "delivery" ? form.address_neighborhood : null,
      address_city: form.fulfillment_type === "delivery" ? form.address_city : null,
      notes: form.notes || null,
      items,
      subtotal,
      delivery_fee: deliveryFee,
      total,
    };

    const { data, error } = await supabase.from("orders").insert(payload).select("id").single();
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro ao enviar pedido", description: error.message, variant: "destructive" });
      return;
    }
    setSubmittedOrder({ id: data.id, total });
    setCheckoutOpen(false);
    setCartOpen(false);
    setConfirmOpen(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold leading-tight truncate">ShiftUp Cardápio</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">Aberto agora • Entrega e Retirada</p>
          </div>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="default" size="icon" className="relative sm:hidden h-10 w-10 flex-shrink-0">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
              <Button variant="default" className="relative hidden sm:inline-flex">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Carrinho
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1.5">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Seu pedido</SheetTitle>
                <SheetDescription>Revise os itens antes de finalizar</SheetDescription>
              </SheetHeader>
              <ScrollArea className="flex-1 -mx-6 px-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-md object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatBRL(Number(item.product.price))}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updateQty(item.product.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updateQty(item.product.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">
                          {formatBRL(Number(item.product.price) * item.qty)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {cart.length > 0 && (
                <SheetFooter className="border-t pt-4">
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatBRL(subtotal)}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => setCheckoutOpen(true)}>
                      Finalizar pedido • {formatBRL(subtotal)}
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-2 sm:pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="pl-9 h-10"
            />
          </div>
        </div>

        {/* Category tabs */}
        <nav className="max-w-5xl mx-auto px-3 sm:px-4 pb-2.5 sm:pb-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToCat(c.id)}
                className={`whitespace-nowrap rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition ${
                  activeCat === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Catalog */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          categories.map((c) => {
            const items = productsByCat[c.id] ?? [];
            if (items.length === 0) return null;
            return (
              <section
                key={c.id}
                ref={(el) => { sectionRefs.current[c.id] = el; }}
                className="mb-8 sm:mb-10 scroll-mt-44"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{c.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="text-left flex gap-3 p-2.5 sm:p-3 rounded-lg border bg-card hover:border-primary hover:shadow-md active:scale-[0.99] transition"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{p.name}</h3>
                        {p.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">
                            {p.description}
                          </p>
                        )}
                        <p className="font-bold text-primary mt-1.5 sm:mt-2 text-sm sm:text-base">{formatBRL(Number(p.price))}</p>
                      </div>
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Floating cart bar (mobile-friendly) */}
      {cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 max-w-5xl mx-auto">
          <Button
            size="lg"
            className="w-full shadow-lg h-12 sm:h-14 text-sm sm:text-base"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Ver carrinho ({cartCount}) • {formatBRL(subtotal)}
          </Button>
        </div>
      )}

      {/* Checkout dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg w-[calc(100%-1.5rem)] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle>Finalizar pedido</DialogTitle>
            <DialogDescription>Preencha seus dados para concluir</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Como deseja receber?</Label>
              <RadioGroup
                value={form.fulfillment_type}
                onValueChange={(v) => setForm({ ...form, fulfillment_type: v as "delivery" | "pickup" })}
                className="grid grid-cols-2 gap-2"
              >
                <label
                  className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition ${
                    form.fulfillment_type === "delivery" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem value="delivery" />
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Entrega</span>
                </label>
                <label
                  className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition ${
                    form.fulfillment_type === "pickup" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem value="pickup" />
                  <Store className="h-4 w-4" />
                  <span className="text-sm font-medium">Retirada</span>
                </label>
              </RadioGroup>
            </div>

            {form.fulfillment_type === "delivery" && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={form.address_street}
                      onChange={(e) => setForm({ ...form, address_street: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="num">Número</Label>
                    <Input
                      id="num"
                      value={form.address_number}
                      onChange={(e) => setForm({ ...form, address_number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="comp">Complemento</Label>
                    <Input
                      id="comp"
                      value={form.address_complement}
                      onChange={(e) => setForm({ ...form, address_complement: e.target.value })}
                      placeholder="Apto, bloco..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={form.address_neighborhood}
                      onChange={(e) => setForm({ ...form, address_neighborhood: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={form.address_city}
                    onChange={(e) => setForm({ ...form, address_city: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="mb-2 block">Forma de pagamento</Label>
              <RadioGroup
                value={form.payment_method}
                onValueChange={(v) => setForm({ ...form, payment_method: v as typeof form.payment_method })}
                className="grid grid-cols-2 gap-2"
              >
                {[
                  { v: "pix", l: "PIX" },
                  { v: "dinheiro", l: "Dinheiro" },
                  { v: "cartao_credito", l: "Cartão Crédito" },
                  { v: "cartao_debito", l: "Cartão Débito" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className={`flex items-center gap-2 border rounded-lg p-2.5 cursor-pointer transition text-sm ${
                      form.payment_method === opt.v ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <RadioGroupItem value={opt.v} />
                    <span>{opt.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Sem cebola, troco para R$ 100..."
                rows={2}
              />
            </div>

            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {form.fulfillment_type === "delivery" ? "Taxa de entrega" : "Retirada"}
                </span>
                <span>{deliveryFee > 0 ? formatBRL(deliveryFee) : "Grátis"}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)} disabled={submitting} className="w-full sm:w-auto">
              Voltar
            </Button>
            <Button onClick={handleSubmitOrder} disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-center">Pedido enviado!</DialogTitle>
            <DialogDescription className="text-center">
              Recebemos seu pedido e em breve entraremos em contato pelo WhatsApp.
            </DialogDescription>
          </DialogHeader>
          {submittedOrder && (
            <div className="space-y-1 py-2">
              <p className="text-xs text-muted-foreground">Número do pedido</p>
              <p className="font-mono text-sm">{submittedOrder.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-2xl font-bold mt-3">{formatBRL(submittedOrder.total)}</p>
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={() => setConfirmOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
