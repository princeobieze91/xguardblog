"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { 
  Settings, Users, FolderOpen, Database, Shield, 
  Edit, Trash2, Plus, Save, Loader2, CheckCircle, AlertCircle, Zap
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Tab = "general" | "categories" | "users" | "stats" | "bot";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#6C63FF" });
  const supabase = createClient();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { redirect("/login?redirect=/dashboard/settings"); return; }
    
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profile?.role !== "admin") { redirect("/dashboard"); return; }
    
    setUser(user);
    setProfile(profile);
    
    const [cats, usersData, statsData] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.rpc("get_post_stats").single()
    ]);
    
    setCategories(cats.data ?? []);
    setUsers(usersData.data ?? []);
    
    const postsData = await supabase.from("posts").select("id, status", { count: "exact" });
    const articlesData = await supabase.from("articles").select("id, status", { count: "exact" });
    const subscribersData = await supabase.from("subscribers").select("id", { count: "exact" });
    
    setStats({
      totalPosts: postsData.count ?? 0,
      publishedPosts: postsData.data?.filter(p => p.status === "published").length ?? 0,
      totalArticles: articlesData.count ?? 0,
      publishedArticles: articlesData.data?.filter(a => a.status === "published").length ?? 0,
      totalSubscribers: subscribersData.count ?? 0,
      totalUsers: usersData.data?.length ?? 0,
    });
    
    setLoading(false);
  }

  async function handleAddCategory() {
    if (!newCategory.name.trim()) return;
    setSaving(true);
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const { error } = await supabase.from("categories").insert({
      name: newCategory.name,
      slug,
      color: newCategory.color,
    });
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Category added!" });
      setNewCategory({ name: "", color: "#6C63FF" });
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data ?? []);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    setCategories(categories.filter(c => c.id !== id));
    setMessage({ type: "success", text: "Category deleted" });
  }

  async function handleUpdateUserRole(userId: string, newRole: "reader" | "author" | "admin") {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setMessage({ type: "success", text: "User role updated" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "categories", label: "Categories", icon: FolderOpen },
    { id: "users", label: "Users", icon: Users },
    { id: "stats", label: "Statistics", icon: Database },
    { id: "bot", label: "Trend Bot", icon: Zap },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-500" />
          Admin Settings
        </h1>
        <p className="text-dark-500 mt-1">Manage your blog settings and content</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto text-sm hover:underline">Dismiss</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-dark-200 dark:border-dark-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Site Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Site Name" defaultValue="XGuard" />
              <Input label="Site URL" defaultValue="https://xguardblog.vercel.app" />
              <Input label="Tagline" defaultValue="Ideas worth sharing" className="md:col-span-2" />
            </div>
            <div className="mt-4">
              <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <Input label="Default Meta Title" defaultValue="XGuard Blog" />
              <Input label="Default Meta Description" defaultValue="A modern blog platform for ideas that matter." className="w-full" />
              <Input label="Google Verification" defaultValue="p4HkfOy2U9rJ38jmTwlu_7LsfuMAzCS2NRUrUu25nio" />
            </div>
            <div className="mt-4">
              <Button><Save className="w-4 h-4 mr-2" /> Save SEO</Button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Social Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Twitter URL" placeholder="https://twitter.com/..." />
              <Input label="GitHub URL" placeholder="https://github.com/..." />
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." className="md:col-span-2" />
            </div>
            <div className="mt-4">
              <Button><Save className="w-4 h-4 mr-2" /> Save Social Links</Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Add New Category</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input 
                  label="Category Name" 
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Color</label>
                <input 
                  type="color" 
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-12 h-10 rounded-input border border-dark-200 dark:border-dark-600 cursor-pointer"
                />
              </div>
              <Button onClick={handleAddCategory} disabled={saving || !newCategory.name.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </Button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
              Existing Categories ({categories.length})
            </h2>
            {categories.length === 0 ? (
              <p className="text-dark-400 py-4 text-center">No categories yet</p>
            ) : (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium text-dark-900 dark:text-white">{cat.name}</span>
                      <span className="text-xs text-dark-400">{cat.slug}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
            User Management ({users.length} users)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-700">
                  <th className="text-left py-3 px-2 text-dark-500 font-medium">User</th>
                  <th className="text-left py-3 px-2 text-dark-500 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-dark-500 font-medium">Role</th>
                  <th className="text-left py-3 px-2 text-dark-500 font-medium">Joined</th>
                  <th className="text-left py-3 px-2 text-dark-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-semibold text-xs">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-dark-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-dark-500">{u.email}</td>
                    <td className="py-3 px-2">
                      <select 
                        value={u.role ?? "reader"}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value as "reader" | "author" | "admin")}
                        disabled={u.id === user?.id}
                        className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-dark-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      {u.id !== user?.id && (
                        <button className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-500 mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-dark-900 dark:text-white">{stats?.totalPosts ?? 0}</p>
              <p className="text-xs text-dark-400 mt-1">{stats?.publishedPosts ?? 0} published</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-500 mb-2">Total Articles</h3>
              <p className="text-3xl font-bold text-dark-900 dark:text-white">{stats?.totalArticles ?? 0}</p>
              <p className="text-xs text-dark-400 mt-1">{stats?.publishedArticles ?? 0} published</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-500 mb-2">Subscribers</h3>
              <p className="text-3xl font-bold text-dark-900 dark:text-white">{stats?.totalSubscribers ?? 0}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-500 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-dark-900 dark:text-white">{stats?.totalUsers ?? 0}</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Database Health</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">Database Connected</p>
                <p className="text-sm text-green-600 dark:text-green-500">Supabase is operational</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">Auth Enabled</p>
                <p className="text-sm text-green-600 dark:text-green-500">User authentication active</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">Real-time Active</p>
                <p className="text-sm text-green-600 dark:text-green-500">Postgres changes subscribed</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">Storage Ready</p>
                <p className="text-sm text-green-600 dark:text-green-500">Image uploads available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bot Tab */}
      {activeTab === "bot" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-2">XGuard Trend Bot</h2>
            <p className="text-dark-500 text-sm mb-4">Automated content from European tech sources, FX markets, and AI generation.</p>
            
            <div className="bg-dark-50 dark:bg-dark-800 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Data Sources</h3>
              <ul className="text-sm text-dark-500 space-y-1">
                <li>- NewsData.io (European tech/business)</li>
                <li>- Alpha Vantage (FX rates)</li>
                <li>- RSS: ENISA, Tech.eu, EU-Startups</li>
                <li>- Google Gemini (AI content generation)</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={async () => {
                setSaving(true);
                try {
                  const response = await fetch("/api/trigger-bot", { method: "POST" });
                  const data = await response.json();
                  setMessage({ type: response.ok ? "success" : "error", text: data.message || data.error });
                } catch (e: any) {
                  setMessage({ type: "error", text: e.message });
                }
                setSaving(false);
              }} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Run Bot Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}