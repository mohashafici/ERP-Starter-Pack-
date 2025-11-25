import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Loader2 } from 'lucide-react';

export default function SetupBusiness() {
  const navigate = useNavigate();
  const { user, businessId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in or already has business
  if (!user) {
    navigate('/auth');
    return null;
  }

  if (businessId) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const businessName = formData.get('business-name') as string;
    const fullName = formData.get('full-name') as string;
    const phone = formData.get('phone') as string;

    try {
      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: businessName,
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          business_id: business.id,
          full_name: fullName,
          email: user.email!,
          phone: phone || null,
        });

      if (profileError) throw profileError;

      toast({
        title: 'Business created!',
        description: 'Your business has been set up successfully.',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error creating business:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create business',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Setup Your Business</h1>
          <p className="text-muted-foreground mt-2">Let's get started with your business profile</p>
        </div>

        <Card className="shadow-soft-md">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Provide details about your business</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  name="business-name"
                  type="text"
                  placeholder="My Business"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Your Full Name</Label>
                <Input
                  id="full-name"
                  name="full-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
