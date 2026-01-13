import React, { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Upload,
    Trash2,
    Plus,
    Save,
    Loader2,
    Sparkles,
    Zap,
    Layout,
    Eye,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import { FloatingDock } from "@/components/FloatingDock";
import { CommandPalette } from "@/components/CommandPalette";
import { FloatingNotifications } from "@/components/FloatingNotifications";
import { cn } from "@/lib/utils";

interface HeroBanner {
    url: string;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string;
}

const Settings = () => {
    const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const token = localStorage.getItem("adminToken") || "";

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await adminAPI.settings.get(token);
            if (response.success) {
                const banners = response.data.heroBanners || [];
                setHeroBanners(banners);
                if (banners.length > 0) setActiveIndex(0);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await adminAPI.upload.singleImage(file, token);
            if (response.success) {
                const newBanners = [...heroBanners];
                newBanners[index].url = response.data.url;
                setHeroBanners(newBanners);
                toast({ title: "Success", description: "Image updated" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: "Upload failed", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const addBanner = () => {
        const newBanners = [
            ...heroBanners,
            { url: "", title: "New Banner", subtitle: "", buttonText: "Shop Now", link: "/products" },
        ];
        setHeroBanners(newBanners);
        setActiveIndex(newBanners.length - 1);
    };

    const removeBanner = (index: number) => {
        const newBanners = heroBanners.filter((_, i) => i !== index);
        setHeroBanners(newBanners);
        if (activeIndex === index) {
            setActiveIndex(newBanners.length > 0 ? 0 : null);
        } else if (activeIndex !== null && activeIndex > index) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const updateBannerField = (index: number, field: keyof HeroBanner, value: string) => {
        const newBanners = [...heroBanners];
        newBanners[index][field] = value;
        setHeroBanners(newBanners);
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await adminAPI.settings.updateHeroBanners(heroBanners, token);
            if (response.success) {
                toast({ title: "Success", description: "Settings synchronized" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: "Sync failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-primary animate-spin" />
                    <SettingsIcon className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>
        );
    }

    const activeBanner = activeIndex !== null ? heroBanners[activeIndex] : null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-primary/20 overflow-hidden flex flex-col">
            <CommandPalette />
            <FloatingNotifications />
            <FloatingDock />

            {/* Premium Light Header */}
            <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 relative z-20">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                        <SettingsIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">System Settings</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Global Configuration</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 text-white px-6 h-10 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />}
                        Save Changes
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Fixed Banner Navigation Sidebar */}
                <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Banners</h2>
                        <Button
                            onClick={addBanner}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors bg-slate-50"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-20 scrollbar-hide">
                        {heroBanners.map((banner, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border",
                                    activeIndex === index
                                        ? "bg-white border-primary/20 shadow-xl shadow-primary/5 translate-x-1"
                                        : "bg-transparent border-transparent hover:bg-slate-50"
                                )}
                            >
                                <div className="h-14 w-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-200 shadow-sm">
                                    {banner.url ? (
                                        <img src={banner.url} className="h-full w-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-50">
                                            <ImageIcon className="h-4 w-4 text-slate-300" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 transition-opacity",
                                        activeIndex === index ? "opacity-100" : "group-hover:opacity-100"
                                    )}>
                                        <Eye className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-bold truncate transition-colors",
                                        activeIndex === index ? "text-primary" : "text-slate-700"
                                    )}>
                                        {banner.title || "Untitled Banner"}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">
                                        Slide {index + 1}
                                    </p>
                                </div>
                                {activeIndex === index && (
                                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                                )}
                            </button>
                        ))}

                        {heroBanners.length === 0 && (
                            <div className="py-20 text-center px-4">
                                <Layout className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm font-medium text-slate-400">Add a banner to get started</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Refined Editor Canvas */}
                <section className="flex-1 bg-[#F8FAFC] relative flex flex-col p-6 lg:p-12 overflow-y-auto">
                    {activeBanner ? (
                        <div className="max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Quick Actions Bar */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-accent/10 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Design Canvas</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => removeBanner(activeIndex!)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-10 px-6 font-bold gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Slide
                                </Button>
                            </div>

                            {/* Immersive Preview Section */}
                            <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                                <div className="relative aspect-[21/9] rounded-[24px] overflow-hidden group border border-slate-200 shadow-inner">
                                    {activeBanner.url ? (
                                        <img src={activeBanner.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-4">
                                            <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                <Upload className="h-8 w-8 text-slate-200" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Image Workspace Blank</p>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
                                        <div className="max-w-xl space-y-2">
                                            <h4 className="text-4xl font-black text-white drop-shadow-2xl">{activeBanner.title || "Your Title"}</h4>
                                            <p className="text-white/80 text-lg font-medium drop-shadow-lg">{activeBanner.subtitle || "Your Subtitle Description"}</p>
                                        </div>
                                    </div>

                                    <label className="absolute top-6 right-6 bg-white/90 hover:bg-white backdrop-blur-xl border border-white text-slate-900 px-6 h-12 rounded-full flex items-center gap-2 cursor-pointer shadow-xl transition-all active:scale-95 font-bold">
                                        <Input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, activeIndex!)} />
                                        <Upload className="h-4 w-4 text-primary" />
                                        {uploading ? "SYNCING..." : "REPLACE ART"}
                                    </label>
                                </div>
                            </div>

                            {/* Refined Content Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Primary Heading</Label>
                                        <Input
                                            value={activeBanner.title}
                                            onChange={(e) => updateBannerField(activeIndex!, "title", e.target.value)}
                                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-bold rounded-2xl"
                                            placeholder="Enter Main Heading"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Secondary Caption</Label>
                                        <Input
                                            value={activeBanner.subtitle}
                                            onChange={(e) => updateBannerField(activeIndex!, "subtitle", e.target.value)}
                                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium rounded-2xl"
                                            placeholder="Enter Subtitle Text"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Action Button Label</Label>
                                        <Input
                                            value={activeBanner.buttonText}
                                            onChange={(e) => updateBannerField(activeIndex!, "buttonText", e.target.value)}
                                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold rounded-2xl"
                                            placeholder="e.g. SHOP COLLECTION"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Destination Path</Label>
                                        <div className="relative">
                                            <Input
                                                value={activeBanner.link}
                                                onChange={(e) => updateBannerField(activeIndex!, "link", e.target.value)}
                                                className="h-14 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm rounded-2xl pl-12"
                                                placeholder="/products/new-arrivals"
                                            />
                                            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-32 w-32 rounded-[40px] bg-white shadow-xl flex items-center justify-center animate-bounce duration-[2000ms]">
                                <Layout className="h-12 w-12 text-slate-100" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">Empty State</h3>
                            <p className="text-slate-400 font-medium max-w-sm">Select an existing banner or create a new creative masterpiece.</p>
                            <Button onClick={addBanner} className="rounded-full px-10 h-14 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                <Plus className="h-6 w-6 mr-2" />
                                INITIALIZE BANNER
                            </Button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Settings;
