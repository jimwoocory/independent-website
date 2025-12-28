import { redirect } from 'next/navigation';

// Root page that redirects to the default locale (zh)
export default function RootPage() {
  // Redirect to Chinese locale as default
  redirect('/zh');
}
