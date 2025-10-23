import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Text } from '../components/ui/text';
import { Skeleton } from '../components/ui/skeleton';

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // Redireccionar basado en el estado de autenticación
      if (session) {
        router.replace('/(dashboard)/dashboard');
      } else {
        router.replace('/login');
      }
      
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session) {
        router.replace('/(dashboard)/dashboard');
      } else {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContent}>
          {/* Logo skeleton */}
          <Skeleton style={styles.logoSkeleton} />
          
          {/* Título skeleton */}
          <Skeleton style={styles.titleSkeleton} />
          
          {/* Subtítulo skeleton */}
          <Skeleton style={styles.subtitleSkeleton} />
          
          {/* Texto de carga */}
          <Text variant="small" style={styles.loadingText}>
            Verificando autenticación...
          </Text>
        </View>
      </View>
    );
  }

  // Esta página no debería renderizarse nunca después del loading
  // porque siempre redirige, pero por si acaso:
  return (
    <View style={styles.container}>
      <View style={styles.loadingContent}>
        <Text variant="h2" style={styles.appName}>Incluir</Text>
        <Text variant="muted">Redirigiendo...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  logoSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  titleSkeleton: {
    width: 200,
    height: 32,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    width: 280,
    height: 16,
    marginBottom: 16,
  },
  loadingText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  appName: {
    color: '#3b82f6',
    fontWeight: '700',
    marginBottom: 8,
  },
});