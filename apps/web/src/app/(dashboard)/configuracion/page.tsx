"use client";

import { useState } from "react";
import { Building2, Users, Shield, Cog } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="space-y-6">
            <PageHeader
                title="Configuración"
                description="Administra la configuración de tu sistema"
            />

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    activeTab === tab.id
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === "empresa" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de la Empresa</CardTitle>
                                <CardDescription>
                                    Configura los datos básicos de tu negocio
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Logo de la empresa</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                                            <Building2 className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <Button variant="outline">Subir imagen</Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Form Fields */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre comercial</label>
                                        <Input defaultValue={COMPANY_INFO.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">RNC / NIT</label>
                                        <Input placeholder="000-000000-0" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-medium">Dirección</label>
                                        <Input placeholder="Calle Principal #123, Ciudad" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Teléfono</label>
                                        <Input placeholder="(809) 000-0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="contacto@empresa.com" />
                                    </div>
                                </div>

                                <Separator />

                                <Button>Guardar cambios</Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "usuarios" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Usuarios</CardTitle>
                                <CardDescription>
                                    Administra los usuarios del sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Configuración de usuarios próximamente...
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "permisos" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Permisos y Roles</CardTitle>
                                <CardDescription>
                                    Define los roles y permisos del sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Configuración de permisos próximamente...
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "sistema" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración del Sistema</CardTitle>
                                <CardDescription>
                                    Ajustes generales del sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Configuración del sistema próximamente...
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
