import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Anchor, Save, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedApiKey = localStorage.getItem("notion_api_key");
    const savedDatabaseId = localStorage.getItem("notion_database_id");
    
    if (savedApiKey && savedDatabaseId) {
      setNotionApiKey(savedApiKey);
      setNotionDatabaseId(savedDatabaseId);
      setIsConnected(true);
    }
  }, []);

  const handleSave = () => {
    if (!notionApiKey || !notionDatabaseId) {
      toast({
        title: "Missing Information",
        description: "Please provide both API key and Database ID",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("notion_api_key", notionApiKey);
    localStorage.setItem("notion_database_id", notionDatabaseId);
    setIsConnected(true);

    toast({
      title: "Notion Connected!",
      description: "Your notes will now sync to Notion",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem("notion_api_key");
    localStorage.removeItem("notion_database_id");
    setNotionApiKey("");
    setNotionDatabaseId("");
    setIsConnected(false);

    toast({
      title: "Disconnected",
      description: "Notion integration has been removed",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-bright">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-ocean-deep/80 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-white">Chaos Captain</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Back to App
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Settings</h2>
            <p className="text-ocean-light">Configure your integrations</p>
          </div>

          {/* Notion Integration */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                Notion Integration
                {isConnected && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Connected
                  </span>
                )}
              </h3>
              <p className="text-sm text-ocean-light">
                Automatically send your notes to Notion
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-white">
                  Notion API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="secret_..."
                  value={notionApiKey}
                  onChange={(e) => setNotionApiKey(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
                <a
                  href="https://www.notion.so/my-integrations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  Get your API key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2">
                <Label htmlFor="databaseId" className="text-white">
                  Database ID
                </Label>
                <Input
                  id="databaseId"
                  placeholder="abc123..."
                  value={notionDatabaseId}
                  onChange={(e) => setNotionDatabaseId(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-ocean-light">
                  Found in your Notion database URL
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  variant="hero"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isConnected ? "Update" : "Connect"}
                </Button>
                {isConnected && (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-4">
            <h4 className="font-semibold text-white">Setup Instructions</h4>
            <ol className="text-sm text-ocean-light space-y-2 list-decimal list-inside">
              <li>Create a Notion integration at notion.so/my-integrations</li>
              <li>Copy the "Internal Integration Token"</li>
              <li>Create or open a database in Notion</li>
              <li>Share the database with your integration</li>
              <li>Copy the database ID from the URL</li>
              <li>Paste both values above and click Connect</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
