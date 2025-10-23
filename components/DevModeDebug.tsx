import React from 'react';
import { View } from 'react-native';
import { Text } from './ui/text';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useDevMode } from '../contexts/DevModeContext';

export default function DevModeDebug() {
  const { settings, isDevMode } = useDevMode();

  if (!isDevMode) return null;

  return (
    <Card className="m-4 border-red-500 bg-red-50">
      <CardContent className="p-4">
        <Text variant="small" className="font-bold text-red-800 mb-2">
          DEBUG - Dev Mode Status:
        </Text>
        <View className="flex-row gap-2 flex-wrap">
          <Badge variant={isDevMode ? "destructive" : "outline"}>
            <Text className="text-xs">
              DevMode: {isDevMode ? 'ON' : 'OFF'}
            </Text>
          </Badge>
          <Badge variant={settings.skipTimeValidation ? "destructive" : "outline"}>
            <Text className="text-xs">
              SkipTime: {settings.skipTimeValidation ? 'ON' : 'OFF'}
            </Text>
          </Badge>
          <Badge variant={settings.skipLocationValidation ? "destructive" : "outline"}>
            <Text className="text-xs">
              SkipLocation: {settings.skipLocationValidation ? 'ON' : 'OFF'}
            </Text>
          </Badge>
        </View>
      </CardContent>
    </Card>
  );
}