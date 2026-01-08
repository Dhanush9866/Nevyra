import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import Typography from '@/constants/typography';
import { useAuth } from '@/store/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/(home)' as any);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
          style={styles.header}
        >
          <AppText
            variant="h1"
            color={Colors.white}
            weight="bold"
            style={styles.logo}
          >
            Z
          </AppText>
          <AppText variant="h2" color={Colors.white} weight="semibold">
            Welcome Back
          </AppText>
          <AppText variant="body" color={Colors.white} style={styles.subtitle}>
            Sign in to continue shopping
          </AppText>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
          >
            <AppText
              variant="caption"
              color={Colors.primary}
              weight="semibold"
              align="right"
            >
              Forgot Password?
            </AppText>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.button}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <AppText variant="caption" color={Colors.textSecondary}>
              OR
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footer}>
            <AppText variant="body" color={Colors.textSecondary}>
              Don&apos;t have an account?{' '}
            </AppText>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <AppText variant="body" color={Colors.primary} weight="semibold">
                Sign Up
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    fontSize: 80,
    lineHeight: 80,
  },
  subtitle: {
    marginTop: Spacing.sm,
    opacity: 0.9,
  },
  form: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.base,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.base,
    color: Colors.text,
  },
  button: {
    marginTop: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
