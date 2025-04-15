import { SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Bold': require("../assets/fonts/Inter_18pt-Bold.ttf"),
    'Inter-Medium': require("../assets/fonts/Inter_18pt-Medium.ttf"),
    'Inter-Regular': require("../assets/fonts/Inter_18pt-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
