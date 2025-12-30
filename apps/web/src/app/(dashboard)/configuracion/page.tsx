"use client";

import { useState } from "react";
import { Building2, Users, Shield, Cog, Upload, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { COMPANY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "empresa", label: "Empresa", icon: Building2 },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "permisos", label: "Permisos", icon: Shield },
    { id: "sistema", label: "Sistema", icon: Cog },
];

export default function ConfiguracionPage() {
    const [activeTab, setActiveTab] = useState("empresa");

    return (
        <div className="space-y-6 relative h-full">
            <PageHeader
                title="Configuración"
                description="Panel de control del sistema"
            />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-1 sticky top-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full max-w-3xl">
                    {activeTab === "empresa" ? (
                        <div className="space-y-8 pb-20">
                            {/* Identidad de Marca */}
                            <section className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Identidad de Marca</h3>
                                    <p className="text-sm text-muted-foreground">Logo y nombre público de tu negocio.</p>
                                </div>
                                <Separator />

                                <div className="grid gap-6">
                                    {/* Logo Uploader */}
                                    <div className="flex items-start gap-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center ring-4 ring-background shadow-lg overflow-hidden">
                                                {/* Mock existing logo */}
                                                <span className="text-2xl font-bold text-white">FE</span>

                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                                            <div className="p-3 bg-background rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground">Haz clic para subir o arrastra</p>
                                            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 800x400px)</p>
                                        </div>
                                    </div>

                                    {/* Brand Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2 space-y-2">
                                            <Label>Nombre Comercial</Label>
                                            <Input defaultValue={COMPANY_INFO.name} className="bg-background" />
                                        </div>
                                        <div className="sm:col-span-1 space-y-2">
                                            <Label>NIT / RNC</Label>
                                            <Input placeholder="000-000000-0" className="bg-background" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Datos de Contacto */}
                            <section className="space-y-6 pt-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Datos de Contacto</h3>
                                    <p className="text-sm text-muted-foreground">Información pública para tus facturas y clientes.</p>
                                </div>
                                <Separator />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label>Dirección Fiscal</Label>
                                        <Input placeholder="Av. Principal #123, Zona Comercial" className="bg-background" />
                                    </div>

                                    <div className="sm:col-span-1 space-y-2">
                                        <Label>Teléfono</Label>
                                        <Input placeholder="(+591)" className="bg-background" />
                                    </div>

                                    <div className="sm:col-span-2 space-y-2">
                                        <Label>Correo Electrónico</Label>
                                        <Input type="email" defaultValue={COMPANY_INFO.user.email} className="bg-background" />
                                    </div>
                                </div>
                            </section>

                            {/* Sticky Action Bar */}
                            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                                <Button size="lg" className="shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-full px-8 h-12">
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[50vh] items-center justify-center rounded-xl border border-dashed border-border p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="max-w-md space-y-2">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <Cog className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">Configuración en desarrollo</h3>
                                <p className="text-sm text-muted-foreground">
                                    El módulo de <strong>{tabs.find(t => t.id === activeTab)?.label}</strong> estará disponible en la próxima actualización.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
