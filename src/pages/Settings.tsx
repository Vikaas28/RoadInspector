import { useState } from 'react';
import { User, Bell, Shield, Database, Key, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    pushAlerts: false,
    weeklyDigest: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Settings saved',
      description: 'Your profile has been updated.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  value={profile.organization}
                  onChange={(e) => setProfile(p => ({ ...p, organization: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-6 mt-6">
            <h3 className="text-lg font-semibold">Security</h3>
            
            <div className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <p className="text-sm text-muted-foreground">
                Last password change: Never
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive inspection reports via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReports}
                  onCheckedChange={(v) => setNotifications(n => ({ ...n, emailReports: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about high-severity detections
                  </p>
                </div>
                <Switch
                  checked={notifications.pushAlerts}
                  onCheckedChange={(v) => setNotifications(n => ({ ...n, pushAlerts: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">
                    Summary of inspections and findings
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(v) => setNotifications(n => ({ ...n, weeklyDigest: v }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">ML Inference API</h3>
            <p className="text-muted-foreground">
              Configure the YOLO model API endpoint for pothole detection.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Endpoint URL</Label>
                <Input
                  id="api-url"
                  placeholder="https://your-ml-api.com/v1/detect"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">About best.pt Integration</h4>
              <p className="text-sm text-muted-foreground">
                The YOLO model (best.pt) needs to be deployed on a separate server with GPU support.
                Once deployed, enter the API endpoint above to enable real-time detection.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Recommended:</strong> Deploy using FastAPI + PyTorch on AWS/GCP with GPU instances.
              </p>
            </div>

            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save API Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
