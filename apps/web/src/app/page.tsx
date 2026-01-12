"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LayoutGrid,
    Receipt,
    Package,
    BarChart3,
    ShoppingCart,
    TrendingUp,
    Check,
    CheckCircle,
    PlayCircle,
    ChevronRight
} from "lucide-react";

export default function LandingPage() {
    const router = useRouter();

    const handleWhatsApp = () => {
        window.open("https://wa.me/59172234501?text=Hola,%20quiero%20información%20sobre%20el%20sistema%20ERP", "_blank");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#121121] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header / Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#121121]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <LayoutGrid className="size-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">
                            WebCody<span className="text-primary">ERP</span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">
                            Características
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#showcase">
                            Showcase
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
                            Precios
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:block text-sm font-semibold px-4 py-2 hover:text-primary transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <button
                            onClick={handleWhatsApp}
                            className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Solicitar Acceso
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 mesh-gradient-bg" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#121121]" />

                <div className="relative max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        SISTEMA EN LA NUBE • ACCESO 24/7
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                        El sistema operativo de tu <br className="hidden md:block" />negocio minorista
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Optimiza tu inventario, ventas y facturación con la plataforma líder diseñada para el mercado boliviano. Potencia tu crecimiento hoy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button
                            onClick={handleWhatsApp}
                            className="w-full sm:w-auto bg-primary text-white text-base font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary/25 hover:translate-y-[-2px] transition-all"
                        >
                            Comenzar ahora
                        </button>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            <PlayCircle className="size-5" />
                            Ya tengo cuenta
                        </Link>
                    </div>

                    {/* Premium Dashboard Preview */}
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/15 to-sky-500/20 blur-3xl rounded-[3rem] opacity-60" />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-blue-500/20 overflow-hidden">
                            {/* Browser Chrome */}
                            <div className="bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                <div className="size-3 rounded-full bg-red-400" />
                                <div className="size-3 rounded-full bg-amber-400" />
                                <div className="size-3 rounded-full bg-green-400" />
                                <div className="ml-4 flex-1 max-w-xs">
                                    <div className="bg-white dark:bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-green-500/30 flex items-center justify-center">
                                            <div className="size-1.5 rounded-full bg-green-500" />
                                        </div>
                                        app.webcody.bo
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Dashboard UI */}
                            <div className="flex h-[400px] md:h-[480px]">
                                {/* Sidebar */}
                                <div className="hidden sm:flex w-16 md:w-20 bg-slate-800 dark:bg-slate-950 flex-col items-center py-4 gap-4 border-r border-slate-700">
                                    <div className="size-8 md:size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <LayoutGrid className="size-4 md:size-5 text-primary" />
                                    </div>
                                    <div className="w-8 h-px bg-slate-700" />
                                    <div className="size-8 md:size-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
                                        <ShoppingCart className="size-4 md:size-5" />
                                    </div>
                                    <div className="size-8 md:size-10 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-500">
                                        <Package className="size-4 md:size-5" />
                                    </div>
                                    <div className="size-8 md:size-10 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-500">
                                        <BarChart3 className="size-4 md:size-5" />
                                    </div>
                                    <div className="size-8 md:size-10 rounded-lg hover:bg-slate-700/50 flex items-center justify-center text-slate-500">
                                        <Receipt className="size-4 md:size-5" />
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col">
                                    {/* Header */}
                                    <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-40 md:w-56 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-600" />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="flex-1 p-4 md:p-6 overflow-hidden">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                                            {/* Stat Card 1 */}
                                            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="size-6 md:size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                        <TrendingUp className="size-3 md:size-4 text-green-500" />
                                                    </div>
                                                </div>
                                                <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Bs. 12,450</div>
                                                <div className="text-[10px] md:text-xs text-slate-400">Ventas Hoy</div>
                                            </div>
                                            {/* Stat Card 2 */}
                                            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="size-6 md:size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                        <ShoppingCart className="size-3 md:size-4 text-blue-500" />
                                                    </div>
                                                </div>
                                                <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">47</div>
                                                <div className="text-[10px] md:text-xs text-slate-400">Órdenes</div>
                                            </div>
                                            {/* Stat Card 3 */}
                                            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="size-6 md:size-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                        <Package className="size-3 md:size-4 text-violet-500" />
                                                    </div>
                                                </div>
                                                <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">1,234</div>
                                                <div className="text-[10px] md:text-xs text-slate-400">Productos</div>
                                            </div>
                                            {/* Stat Card 4 */}
                                            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="size-6 md:size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                                        <BarChart3 className="size-3 md:size-4 text-amber-500" />
                                                    </div>
                                                </div>
                                                <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">+23%</div>
                                                <div className="text-[10px] md:text-xs text-slate-400">Crecimiento</div>
                                            </div>
                                        </div>

                                        {/* Chart Placeholder */}
                                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 h-32 md:h-48">
                                            <div className="flex items-end justify-between h-full gap-2 md:gap-3 pt-4">
                                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm"
                                                        style={{ height: `${h}%` }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute top-24 left-4 md:left-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/40 shadow-xl hidden lg:block animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                                        <TrendingUp className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ventas Hoy</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">Bs. 12,450</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-24 right-4 md:right-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/40 shadow-xl hidden lg:block">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                                        <Package className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Productos</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">1,234 SKUs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-10 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-sm text-slate-400 mb-8 font-medium">
                        Potenciando a negocios minoristas en toda Bolivia
                    </p>
                    <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                        {/* Logo Placeholders */}
                        {["TechRetail", "MiniMarket+", "FarmaCia", "ModaStyle", "ElectroHub", "SuperFresh"].map((name, i) => (
                            <div
                                key={i}
                                className="logo-grayscale px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 cursor-default"
                            >
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 px-6 bg-white dark:bg-[#121121]" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Todo lo que necesitas para crecer</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                            Herramientas potentes diseñadas específicamente para los desafíos del comercio en Bolivia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
                        {/* Large Feature Card - Control Financiero */}
                        <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 hover:border-primary/50 transition-all">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <Receipt className="size-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Control Financiero</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                    Registra ingresos, gastos y mantén control total de tu flujo de caja.
                                </p>

                                {/* Visual: Mini Finance Dashboard */}
                                <div className="flex-1 feature-visual bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-slate-400">Flujo de Caja - Enero</span>
                                        <span className="text-xs font-bold text-green-500">+12.5%</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-20 mb-3">
                                        {[35, 50, 40, 65, 55, 80, 70].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col gap-0.5">
                                                <div
                                                    className="bg-green-500/80 rounded-t-sm"
                                                    style={{ height: `${h}%` }}
                                                />
                                                <div
                                                    className="bg-red-400/60 rounded-b-sm"
                                                    style={{ height: `${h * 0.3}%` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Ingresos: <span className="text-green-500 font-bold">Bs. 45,200</span></span>
                                        <span>Gastos: <span className="text-red-400 font-bold">Bs. 12,800</span></span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm">
                                    <span>Ver más</span>
                                    <ChevronRight className="size-4" />
                                </div>
                            </div>
                        </div>

                        {/* Medium Feature Card - Inventario */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 hover:border-primary/50 transition-all">
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                            <Package className="size-5" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">Inventario Inteligente</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Control de stock con alertas automáticas
                                        </p>
                                    </div>
                                </div>

                                {/* Visual: Stock Level Bars */}
                                <div className="flex-1 feature-visual bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                                    <div className="space-y-2">
                                        {[
                                            { name: "Coca-Cola 2L", stock: 85, color: "bg-green-500" },
                                            { name: "Pan Integral", stock: 45, color: "bg-amber-500" },
                                            { name: "Leche PIL", stock: 15, color: "bg-red-500" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500 w-20 truncate">{item.name}</span>
                                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.stock}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 w-8">{item.stock}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Small Feature Card 1 - Reportes */}
                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 hover:border-primary/50 transition-all">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                <BarChart3 className="size-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Reportes</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                Analítica en tiempo real
                            </p>

                            {/* Visual: Mini Line Chart */}
                            <div className="feature-visual bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                                <svg className="w-full h-12" viewBox="0 0 100 40">
                                    <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-primary"
                                        points="0,35 15,28 30,32 45,20 60,25 75,12 90,18 100,8"
                                    />
                                    <circle cx="100" cy="8" r="3" className="fill-primary" />
                                </svg>
                            </div>
                        </div>

                        {/* Small Feature Card 2 - POS Rápido */}
                        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 hover:border-primary/50 transition-all">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                <ShoppingCart className="size-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">POS Rápido</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                Ventas en segundos
                            </p>

                            {/* Visual: Mini POS Receipt */}
                            <div className="feature-visual bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-[8px] font-mono">
                                <div className="text-center text-slate-400 border-b border-dashed border-slate-300 dark:border-slate-600 pb-1 mb-1">TICKET #0047</div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Coca-Cola x2</span>
                                    <span>Bs.14</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Pan x1</span>
                                    <span>Bs.5</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 border-t border-dashed border-slate-300 dark:border-slate-600 pt-1 mt-1">
                                    <span>TOTAL</span>
                                    <span>Bs.19</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-[#121121]/50" id="showcase">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-16 border border-primary/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                    Tu punto de venta, <br />donde sea que estés
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    Nuestra interfaz está diseñada para ser intuitiva. Reduce el tiempo de capacitación de tu personal de semanas a minutos.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 font-medium">
                                        <CheckCircle className="size-5 text-primary" />
                                        Sincronización automática en la nube
                                    </li>
                                    <li className="flex items-center gap-3 font-medium">
                                        <CheckCircle className="size-5 text-primary" />
                                        Acceso desde cualquier navegador
                                    </li>
                                    <li className="flex items-center gap-3 font-medium">
                                        <CheckCircle className="size-5 text-primary" />
                                        Historial de auditoría anti-robo
                                    </li>
                                </ul>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden">
                                    <div className="bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 px-4 py-3 rounded-t-xl border-b border-slate-200 dark:border-slate-700">
                                        <div className="size-2.5 rounded-full bg-red-400" />
                                        <div className="size-2.5 rounded-full bg-amber-400" />
                                        <div className="size-2.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-blue-500/5 flex items-center justify-center rounded-b-xl">
                                        <ShoppingCart className="size-20 text-primary/20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-white dark:bg-[#121121]" id="pricing">
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Planes diseñados para crecer</h2>
                    <p className="text-slate-500 dark:text-slate-400">Precios transparentes en Bolivianos para tu tranquilidad.</p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Basic Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 hover:border-primary/20 transition-all flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Básico</h3>
                            <p className="text-sm text-slate-500">Perfecto para emprendedores.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black">199 Bs</span>
                            <span className="text-slate-400 font-medium">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-sm">
                                <Check className="size-4 text-green-500" />
                                1 Sucursal
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Check className="size-4 text-green-500" />
                                Hasta 3 usuarios
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Check className="size-4 text-green-500" />
                                POS completo
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400 line-through">
                                Soporte prioritario
                            </li>
                        </ul>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Elegir Básico
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border-2 border-primary shadow-2xl shadow-primary/10 relative flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black tracking-widest uppercase py-1.5 px-4 rounded-full">
                            MÁS POPULAR
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Pro Business</h3>
                            <p className="text-sm text-slate-500">Para negocios en expansión.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black">399 Bs</span>
                            <span className="text-slate-400 font-medium">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex items-center gap-3 text-sm font-semibold">
                                <CheckCircle className="size-4 text-primary" />
                                Todo del plan Básico
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold">
                                <CheckCircle className="size-4 text-primary" />
                                Usuarios ilimitados
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold">
                                <CheckCircle className="size-4 text-primary" />
                                Reportes avanzados
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold">
                                <CheckCircle className="size-4 text-primary" />
                                Soporte prioritario 24/7
                            </li>
                        </ul>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                        >
                            Solicitar Pro
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto rounded-3xl bg-slate-900 dark:bg-primary/20 p-8 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                            Lleva tu negocio al siguiente nivel hoy
                        </h2>
                        <p className="text-slate-400 text-lg mb-10">
                            Únete a comercios en toda Bolivia que ya confían en nuestra tecnología.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/login"
                                className="w-full sm:w-auto bg-white text-slate-900 text-base font-bold px-10 py-4 rounded-xl shadow-xl hover:translate-y-[-2px] transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                            <button
                                onClick={handleWhatsApp}
                                className="w-full sm:w-auto bg-[#25D366] text-white text-base font-bold px-10 py-4 rounded-xl shadow-xl shadow-[#25D366]/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.016 2.041-.54c1.011.603 1.918.91 3.247.91 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.773-5.768-5.773zm3.476 8.204c-.195.549-1.162 1.053-1.597 1.053-.434 0-.822-.192-2.316-.783-1.898-.75-3.111-2.714-3.206-2.84-.095-.126-.772-.927-.772-1.769 0-.841.428-1.254.594-1.422.167-.167.345-.209.46-.209.115 0 .23 0 .33.005.107.005.25-.04.39.294.141.334.48 1.171.521 1.255.042.084.069.183.013.294-.055.111-.082.18-.166.277-.084.097-.176.217-.251.291-.084.084-.171.175-.073.344.098.169.435.719.935 1.165.644.574 1.185.753 1.353.837.168.084.267.07.367-.045.101-.115.428-.499.542-.669.115-.17.23-.143.388-.084.158.059 1 .472 1.171.558.172.086.286.128.329.201.042.073.042.423-.153.972z" />
                                </svg>
                                Hablar con Ventas
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 opacity-60">
                        <div className="size-6 bg-slate-400 rounded flex items-center justify-center text-white">
                            <LayoutGrid className="size-3" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">WebCody ERP</span>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <a className="hover:text-primary" href="#">Privacidad</a>
                        <a className="hover:text-primary" href="#">Términos</a>
                    </div>
                    <p className="text-sm text-slate-400">© 2026 WebCody ERP. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
