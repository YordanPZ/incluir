import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import Account from '../components/Account';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';

export default function AccountPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            if (!session) {
                router.replace('/');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                router.replace('/');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="px-6 pt-16">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <Text variant="h3" className="text-primary font-bold">
                        Incluir
                    </Text>
                    <Text variant="muted">
                        Mi Cuenta
                    </Text>
                </View>

                {/* Account Component */}
                <Account session={session} />
            </View>
        </ScrollView>
    );
}