import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect, useState } from "react";
import OpeningLoader from "./components/startup/OpeningLoader";
import MobileLayout from "./components/layout/MobileLayout";
import { useSplash } from "./components/SplashScreen";
import { ScrollToTop } from "./components/ScrollToTop";
import AppLifecycleManager from "./components/AppLifecycleManager";
import NativeIOSKeyboardManager from "./components/NativeIOSKeyboardManager";
import { OPENING_MIN_MS, OPENING_SLOW_MS } from "./config/startup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { SharedWorkspaceProvider } from "./contexts/SharedWorkspaceContext";
import { useUser } from "@/hooks/useUser";
import { PointsProvider } from "./contexts/PointsContext";
import { useOpeningBootstrap } from "./hooks/useOpeningBootstrap";
import { hideNativeSplash } from "./lib/nativeSplash";
import {
  isOpeningLoaderEnabled,
  OPENING_LOADER_PREF_EVENT,
  resolveOpeningLoaderEnabled,
} from "./lib/openingLoaderPreference";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const GestisciPatrimonio = lazy(() => import("./pages/GestisciPatrimonio"));
const GestisciSalvadanai = lazy(() => import("./pages/GestisciSalvadanai"));
const GestisciSpese = lazy(() => import("./pages/GestisciSpese"));
const Accademia = lazy(() => import("./pages/Accademia"));
const LezioneDetail = lazy(() => import("./pages/LezioneDetail"));
const Coach = lazy(() => import("./pages/Coach"));
const Giochi = lazy(() => import("./pages/Giochi"));
const Esplora = lazy(() => import("./pages/Esplora"));
const EsploraArticolo = lazy(() => import("./pages/EsploraArticolo"));
const AdminEsplora = lazy(() => import("./pages/AdminEsplora"));
const Profilo = lazy(() => import("./pages/Profilo"));
const ProfiloPro = lazy(() => import("./pages/ProfiloPro"));
const Notifiche = lazy(() => import("./pages/Notifiche"));
const FeedbackSuggerimenti = lazy(() => import("./pages/FeedbackSuggerimenti"));
const Tema = lazy(() => import("./pages/Tema"));
const Privacy = lazy(() => import("./pages/Privacy"));
const InfoApp = lazy(() => import("./pages/InfoApp"));
const AdminPosts = lazy(() => import("./pages/AdminPosts"));
const AdminAccademia = lazy(() => import("./pages/AdminAccademia"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Patrimonio = lazy(() => import("./pages/Patrimonio"));
const GestisciInvestimenti = lazy(() => import("./pages/GestisciInvestimenti"));
const PatrimonioCondivisione = lazy(() => import("./pages/PatrimonioCondivisione"));
const PatrimonioCondiviso = lazy(() => import("./pages/PatrimonioCondiviso"));
const GestisciPatrimonioCondiviso = lazy(() => import("./pages/GestisciPatrimonioCondiviso"));
const GestisciInvestimentiCondivisi = lazy(() => import("./pages/GestisciInvestimentiCondivisi"));
const GestisciSalvadanaiCondivisi = lazy(() => import("./pages/GestisciSalvadanaiCondivisi"));
const GestisciSpeseCondivise = lazy(() => import("./pages/GestisciSpeseCondivise"));
const InvitiPatrimonio = lazy(() => import("./pages/InvitiPatrimonio"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, loadingData } = useUser();

  if (authLoading || (user && loadingData)) {
    return null;
  }

  // Not authenticated
  if (!user) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Authenticated but hasn't completed onboarding
  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Authenticated and onboarding completed
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patrimonio" element={<Patrimonio />} />
        <Route path="/patrimonio/gestisci" element={<GestisciPatrimonio />} />
        <Route path="/patrimonio/salvadanai" element={<GestisciSalvadanai />} />
        <Route path="/patrimonio/investimenti" element={<GestisciInvestimenti />} />
        <Route path="/patrimonio/spese" element={<GestisciSpese />} />
        <Route path="/patrimonio/condivisione" element={<PatrimonioCondivisione />} />
        <Route path="/patrimonio/condiviso" element={<PatrimonioCondiviso />} />
        <Route path="/patrimonio/condiviso/gestisci" element={<GestisciPatrimonioCondiviso />} />
        <Route path="/patrimonio/condiviso/investimenti" element={<GestisciInvestimentiCondivisi />} />
        <Route path="/patrimonio/condiviso/salvadanai" element={<GestisciSalvadanaiCondivisi />} />
        <Route path="/patrimonio/condiviso/spese" element={<GestisciSpeseCondivise />} />
        <Route path="/patrimonio/inviti" element={<InvitiPatrimonio />} />
        <Route path="/simulatore" element={<Navigate to="/patrimonio" replace />} />
        <Route path="/accademia" element={<Accademia />} />
        <Route path="/lezione/:id" element={<LezioneDetail />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/esplora" element={<Esplora />} />
        <Route path="/esplora/:id" element={<EsploraArticolo />} />
        <Route path="/profilo" element={<Profilo />} />
        <Route path="/profilo/pro" element={<ProfiloPro />} />
        <Route path="/profilo/giochi" element={<Giochi />} />
        <Route path="/profilo/notifiche" element={<Notifiche />} />
        <Route path="/profilo/suggerimenti" element={<FeedbackSuggerimenti />} />
        <Route path="/profilo/tema" element={<Tema />} />
        <Route path="/profilo/privacy" element={<Privacy />} />
        <Route path="/profilo/info" element={<InfoApp />} />
        <Route path="/profilo/admin-posts" element={<AdminPosts />} />
        <Route path="/profilo/admin-accademia" element={<AdminAccademia />} />
        <Route path="/profilo/admin-esplora" element={<AdminEsplora />} />
      </Route>
      <Route path="/onboarding" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppBootstrapGate = () => {
  const { user, loading: authLoading } = useAuth();
  const { loadingData } = useUser();
  const { SplashComponent } = useSplash();
  const [openingEnabled, setOpeningEnabled] = useState<boolean | null>(() =>
    resolveOpeningLoaderEnabled({ authLoading, userId: user?.id }),
  );
  const { showOpening, canExit, markExited } = useOpeningBootstrap({
    authLoading,
    hasUser: Boolean(user),
    loadingData,
    minDurationMs: OPENING_MIN_MS,
    slowThresholdMs: OPENING_SLOW_MS,
  });

  useEffect(() => {
    void hideNativeSplash();
  }, []);

  useEffect(() => {
    setOpeningEnabled(resolveOpeningLoaderEnabled({ authLoading, userId: user?.id }));
  }, [authLoading, user?.id]);

  useEffect(() => {
    const onPrefChange = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string; enabled?: boolean }>).detail;
      if (!user?.id) return;
      if (detail?.userId !== user.id) return;
      setOpeningEnabled(Boolean(detail.enabled));
    };

    window.addEventListener(OPENING_LOADER_PREF_EVENT, onPrefChange as EventListener);
    return () => window.removeEventListener(OPENING_LOADER_PREF_EVENT, onPrefChange as EventListener);
  }, [user?.id]);

  useEffect(() => {
    if (openingEnabled === false && showOpening) {
      markExited();
    }
  }, [markExited, openingEnabled, showOpening]);

  useEffect(() => {
    if (canExit) {
      markExited();
    }
  }, [canExit, markExited]);

  const shouldShowOpening = openingEnabled === true && showOpening;

  return (
    <>
      <AnimatePresence>{shouldShowOpening ? <OpeningLoader /> : null}</AnimatePresence>
      {!shouldShowOpening && <SplashComponent />}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLifecycleManager />
      <NativeIOSKeyboardManager />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <UserProvider>
            <SharedWorkspaceProvider>
              <PointsProvider>
                <AppBootstrapGate />
              </PointsProvider>
            </SharedWorkspaceProvider>
          </UserProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
