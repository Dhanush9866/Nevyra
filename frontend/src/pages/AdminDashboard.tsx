import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/50 font-roboto flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ExternalLink className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Admin Portal Moved</h2>
          <p className="text-muted-foreground">
            The Zythova Admin panel is a standalone application for better security and performance.
          </p>
          <Button 
            className="w-full"
            onClick={() => window.location.href = 'http://localhost:8082'}
          >
            Go to Admin Panel
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;