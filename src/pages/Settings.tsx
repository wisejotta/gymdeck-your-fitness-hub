import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Bell, Moon, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();
  const [username, setUsername] = useState(user?.username || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null);
    });
  }, []);

  const handleSaveProfile = () => {
    if (user && username.trim()) {
      setUser({ ...user, username: username.trim() });
      toast.success('Profile updated!');
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast.error('Account deletion requires contacting support');
  };

  const handleClearData = () => {
    localStorage.removeItem('gymdeck-storage');
    toast.success('Local data cleared. Refreshing...');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Account
            </CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>
            
            {authUser && (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={authUser.email || ''} disabled className="bg-muted" />
              </div>
            )}

            <Button onClick={handleSaveProfile} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive workout reminders
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Clear Local Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Local Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all locally stored data including your decks and workout history. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Clear Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Sign Out */}
        {authUser && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loading ? 'Signing out...' : 'Sign Out'}
          </Button>
        )}

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>GymDeck v1.0.0</p>
          <p>Made with 💪 for fitness enthusiasts</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
