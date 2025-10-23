import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme, View } from 'react-native';
import { Stack } from 'expo-router';
import { NAV_THEME } from '../lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'react-native';
import { DevModeProvider } from '../contexts/DevModeContext';
import DevModeFloatingButton from '../components/DevModeFloatingButton';
import "../global.css"

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

    return (
        <DevModeProvider>
            <ThemeProvider value={theme}>
                <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
                <View style={{ flex: 1 }}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="register" />
                        <Stack.Screen name="(dashboard)" />
                    </Stack>
                    <DevModeFloatingButton />
                </View>
                <PortalHost />
            </ThemeProvider>
        </DevModeProvider>
    );
}