import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <AppText variant="h1" weight="bold" color={Colors.primary}>
          404
        </AppText>
        <AppText variant="h3" weight="semibold" style={styles.title}>
          Page Not Found
        </AppText>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          align="center"
          style={styles.message}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </AppText>
        <Link href="/(tabs)/(home)" asChild>
          <Button title="Go to Home" onPress={() => {}} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
    backgroundColor: Colors.background,
    gap: Spacing.base,
  },
  title: {
    marginTop: Spacing.md,
  },
  message: {
    marginBottom: Spacing.xl,
  },
});
