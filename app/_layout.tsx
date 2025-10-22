import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { NAV_THEME } from '../lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'react-native';
import "../global.css"

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? NAV_THEME.dark : NAV_THEME.light;

    return (
        <ThemeProvider value={theme}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="account" />
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}