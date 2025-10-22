import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from '../components/Auth';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';

export default function AuthPage() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                router.replace('/account');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (session) {
        router.replace('/account');
        return null;
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="px-6 pt-16">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.back()}
                    >
                        <Text>← Volver</Text>
                    </Button>
                    <Text variant="h3" className="text-primary font-bold">
                        Incluir
                    </Text>
                    <View className="w-16" />
                </View>

                {/* Welcome Text */}
                <View className="mb-8">
                    <Text variant="h2" className="text-center mb-2">
                        Bienvenido
                    </Text>
                    <Text variant="muted" className="text-center">
                        Inicia sesión o crea tu cuenta para comenzar
                    </Text>
                </View>

                {/* Auth Component */}
                <Auth />
            </View>
        </ScrollView>
    );
}