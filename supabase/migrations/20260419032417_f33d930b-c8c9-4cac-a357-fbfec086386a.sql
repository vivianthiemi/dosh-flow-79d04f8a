
-- Categorias
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pedidos
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('delivery','pickup')),
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix','dinheiro','cartao_credito','cartao_debito')),
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Catálogo público (cliente acessa via link sem login)
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (available = true);

-- Pedidos: cliente anônimo pode criar; ninguém pode ler/alterar pelo client (gestão será feita via dashboard admin futuro)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
