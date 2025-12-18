import { useState } from 'react';
import { Check, X, User, Shield, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const [users] = useState([] as any[]);
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: 'User management not yet connected',
      description: 'Approvals will be wired to the real database later.',
    });
  };

  const handleSuspend = () => {
    toast({
      title: 'User management not yet connected',
      description: 'Suspension will be wired to the real database later.',
    });
  };

  const pendingUsers = users.filter(u => !u.approved);
  const activeUsers = users.filter(u => u.approved);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage inspector and admin accounts</p>
      </div>

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-warning" />
            Pending Approvals ({pendingUsers.length})
          </h2>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 text-warning font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
                    {user.role}
                  </span>
                  <Button size="sm" onClick={() => handleApprove(user.id)}>
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Users */}
      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Active Users ({activeUsers.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full font-medium',
                  user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                )}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name}</p>
                    {user.role === 'admin' && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                  <p className="text-xs text-muted-foreground">{user.organization}</p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleSuspend(user.id)}
                    >
                      Suspend User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
