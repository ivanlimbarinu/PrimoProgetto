import React from 'react';
import { View, Text, Image } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

interface AvatarProps {
  uri: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, size = 48 }) => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  const [failed, setFailed] = React.useState(false);
  const radius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface
      }}
    >
      {failed ? (
        <Text style={{ textAlign: "center", lineHeight: size, color: colors.text, fontWeight: 'bold' }}>?</Text>
      ) : (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          onError={() => setFailed(true)}
          accessibilityLabel="Avatar utente"
        />
      )}
    </View>
  );
};