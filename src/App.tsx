import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Pedido from "./pages/Pedido.tsx";
import PedidoV2 from "./pages/PedidoV2.tsx";
import Pedidos from "./pages/Pedidos.tsx";
import ProdutoMockup from "./pages/ProdutoMockup.tsx";
import Loja from "./pages/Loja.tsx";
import Login from "./pages/Login.tsx";
import Perfis from "./pages/Perfis.tsx";
import Precificacao from "./pages/Precificacao.tsx";
import TurnosHistorico from "./pages/TurnosHistorico.tsx";
import PDV from "./pages/PDV.tsx";
import Compras from "./pages/Compras.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/pedido-v2" element={<PedidoV2 />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/produto-mockup" element={<ProdutoMockup />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfis" element={<Perfis />} />
          <Route path="/precificacao" element={<Precificacao />} />
          <Route path="/turnos-historico" element={<TurnosHistorico />} />
          <Route path="/pdv" element={<PDV />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
