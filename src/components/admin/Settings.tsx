import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Artisan Auctions",
    siteDescription: "Premium art auction platform",
    contactEmail: "contact@artisanauctions.com",
    supportEmail: "support@artisanauctions.com",
    commissionRate: "10",
    autoApproveArtworks: false,
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Business
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="border-slate-300 focus:border-amber-500"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                  className="border-slate-300 focus:border-amber-500"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="border-slate-300 focus:border-amber-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) =>
                    setSettings({ ...settings, commissionRate: e.target.value })
                  }
                  className="border-slate-300 focus:border-amber-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoApprove"
                  checked={settings.autoApproveArtworks}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoApproveArtworks: checked })
                  }
                />
                <Label htmlFor="autoApprove">Auto-approve new artworks</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="border-slate-300 focus:border-amber-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
                <Label htmlFor="emailNotifications">
                  Enable email notifications
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>
              <p className="text-sm text-slate-600">
                When enabled, the site will show a maintenance page to regular
                users.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
