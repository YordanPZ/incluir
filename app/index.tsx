import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';

export default function LandingPage() {
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text variant="h2">Incluir</Text>
                    <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.push('/auth')}
                    >
                        <Text>Iniciar Sesión</Text>
                    </Button>
                </View>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <Text variant="h1" style={styles.heroTitle}>
                        Gestión Integral de Servicios Médicos
                    </Text>
                    <Text variant="lead" style={styles.heroSubtitle}>
                        Conectamos doctores con obras sociales para brindar una atención médica más eficiente y accesible
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.button}
                            onPress={() => router.push('/auth')}
                        >
                            <Text>Comenzar Ahora</Text>
                        </Button>
                        <Button
                            variant="outline"
                            style={styles.button}
                            onPress={() => router.push('/auth')}
                        >
                            <Text>Crear Cuenta</Text>
                        </Button>
                    </View>
                </View>
            </View>

            {/* Features Section */}
            <View style={styles.features}>
                <Text variant="h2" style={styles.featuresTitle}>
                    ¿Por qué elegir Incluir?
                </Text>

                <View style={styles.featuresList}>
                    <FeatureCard
                        title="Gestión Simplificada"
                        description="Administra todos tus servicios médicos desde una sola plataforma"
                        icon="📋"
                    />
                    <FeatureCard
                        title="Conexión Directa"
                        description="Conecta directamente con obras sociales y optimiza tus procesos"
                        icon="🔗"
                    />
                    <FeatureCard
                        title="Atención Eficiente"
                        description="Reduce tiempos de espera y mejora la experiencia del paciente"
                        icon="⚡"
                    />
                </View>
            </View>

            {/* CTA Section */}
            <View style={styles.cta}>
                <Text variant="h3" style={styles.ctaTitle}>
                    ¿Listo para transformar tu práctica médica?
                </Text>
                <Text variant="p" style={styles.ctaSubtitle}>
                    Únete a cientos de profesionales que ya confían en Incluir
                </Text>

                <Button
                    size="lg"
                    onPress={() => router.push('/auth')}
                    style={styles.ctaButton}
                >
                    <Text>Empezar Gratis</Text>
                </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text variant="small" style={styles.footerText}>
                    © 2024 Incluir. Todos los derechos reservados.
                </Text>
            </View>
        </ScrollView>
    );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
        <View style={styles.featureCard}>
            <View style={styles.featureContent}>
                <Text style={styles.featureIcon}>{icon}</Text>
                <View style={styles.featureText}>
                    <Text variant="large" style={styles.featureTitle}>
                        {title}
                    </Text>
                    <Text variant="muted">
                        {description}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 32,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 48,
    },
    heroTitle: {
        marginBottom: 16,
        textAlign: 'center',
    },
    heroSubtitle: {
        marginBottom: 32,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        paddingHorizontal: 16,
    },
    button: {
        flex: 1,
    },
    features: {
        paddingHorizontal: 24,
        paddingVertical: 48,
        backgroundColor: '#f8f9fa',
    },
    featuresTitle: {
        textAlign: 'center',
        marginBottom: 32,
    },
    featuresList: {
        gap: 24,
    },
    featureCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    featureContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    featureIcon: {
        fontSize: 24,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        marginBottom: 8,
    },
    cta: {
        paddingHorizontal: 24,
        paddingVertical: 64,
        alignItems: 'center',
    },
    ctaTitle: {
        textAlign: 'center',
        marginBottom: 16,
    },
    ctaSubtitle: {
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    ctaButton: {
        width: '100%',
        maxWidth: 300,
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footerText: {
        textAlign: 'center',
        color: '#6b7280',
    },
});