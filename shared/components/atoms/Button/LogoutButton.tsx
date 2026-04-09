'use client';

import { Button } from '@/shared/components/ui/button';
import { createClient } from '@/shared/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Log out
    </Button>
  );
}
