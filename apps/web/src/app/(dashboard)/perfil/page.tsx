"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Building2, Camera, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
    const router = useRouter();
    const { user, tenant } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement profile update API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mi Perfil"
                description="Administra tu información personal y configuración de cuenta"
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <Shield className="mr-1.5 h-3.5 w-3.5" />
                                {user.role}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>Empresa: <strong className="text-foreground">{tenant?.name || "N/A"}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Plan: <strong className="text-foreground capitalize">{tenant?.plan || "N/A"}</strong></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Información Personal</CardTitle>
                                <CardDescription>
                                    Actualiza tu nombre y configuración de cuenta
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    Editar
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="pl-10 bg-muted"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    El correo no puede ser modificado
                                </p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({ name: user.name, email: user.email });
                                    }}
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <Separator />

                        {/* Security Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Seguridad</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Contraseña</p>
                                        <p className="text-sm text-muted-foreground">
                                            Última actualización hace más de 30 días
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Cambiar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
