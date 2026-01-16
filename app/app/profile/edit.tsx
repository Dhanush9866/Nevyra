import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Edit2 } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Button from '@/components/atoms/Button';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
    const [mobile, setMobile] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');

    const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);

    const avatarMale = "https://res.cloudinary.com/dk6rrrwum/image/upload/v1768559670/avatarmale_y15p1f.jpg";
    const avatarFemale = "https://res.cloudinary.com/dk6rrrwum/image/upload/v1768559670/avatarfemale_h7wtgg.jpg";

    const [selectedAvatar, setSelectedAvatar] = useState(
        user?.name ? `https://i.pravatar.cc/150?u=${user.name}` : avatarMale
    );

    const handleAvatarSelect = (avatarSource: any) => {
        setSelectedAvatar(avatarSource);
        setIsSelectingAvatar(false);
    };

    const handleSubmit = async () => {
        if (!firstName || !lastName) {
            Alert.alert('Error', 'First Name and Last Name are required');
            return;
        }

        setLoading(true);
        try {
            const result = await updateProfile({
                firstName,
                lastName,
                phone: mobile,
                email: email,
            });

            if (result.success) {
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Update Failed', result.message);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Stack.Screen
                options={{
                    title: '',
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: Colors.white,
                    headerShadowVisible: false,
                    headerRight: () => (
                        <View />
                    ),
                }}
            />

            <View style={styles.headerBackground} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileImageContainer}>
                    {isSelectingAvatar ? (
                        <View style={styles.avatarSelectionContainer}>
                            <TouchableOpacity
                                onPress={() => handleAvatarSelect(avatarMale)}
                                activeOpacity={0.8}
                                style={styles.avatarOption}
                            >
                                <Image
                                    source={avatarMale}
                                    style={styles.selectionImage}
                                />
                            </TouchableOpacity>

                            <AppText variant="body" weight="bold" color={Colors.white} style={styles.orText}>or</AppText>

                            <TouchableOpacity
                                onPress={() => handleAvatarSelect(avatarFemale)}
                                activeOpacity={0.8}
                                style={styles.avatarOption}
                            >
                                <Image
                                    source={avatarFemale}
                                    style={styles.selectionImage}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.imageWrapper}>
                            <TouchableOpacity onPress={() => setIsSelectingAvatar(true)} activeOpacity={0.9}>
                                <Image
                                    source={typeof selectedAvatar === 'string' ? { uri: selectedAvatar } : selectedAvatar}
                                    style={styles.profileImage}
                                />
                                <View style={styles.editIconContainer}>
                                    <Edit2 size={16} color={Colors.primary} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.formContainer}>

                    <View style={styles.inputGroup}>
                        <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                            First Name
                        </AppText>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter First Name"
                            placeholderTextColor={Colors.textLight}
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                            Last Name
                        </AppText>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter Last Name"
                            placeholderTextColor={Colors.textLight}
                        />
                        <View style={styles.underlineActive} />
                    </View>

                    <View style={styles.inputGroup}>
                        <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                            Mobile Number
                        </AppText>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            onChangeText={setMobile}
                            placeholder="Enter Mobile Number"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>
                            Email ID
                        </AppText>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter Email ID"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.submitButtonContainer}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <AppText
                                variant="h4"
                                weight="bold"
                                color={loading ? Colors.textLight : Colors.primary}
                            >
                                {loading ? 'SAVING...' : 'SUBMIT'}
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
        backgroundColor: Colors.white,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: Colors.primary,
        zIndex: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    contentContainer: {
        paddingBottom: Spacing.xl,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.white,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    formContainer: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.xl,
    },
    label: {
        marginBottom: Spacing.xs,
        fontSize: 12,
    },
    input: {
        fontSize: 18,
        color: Colors.text,
        paddingVertical: Spacing.xs,
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        fontWeight: '600',
    },
    underline: {
        height: 1,
        backgroundColor: Colors.border,
        marginTop: Spacing.xs,
    },
    underlineActive: {
        height: 2,
        backgroundColor: Colors.primary,
        marginTop: Spacing.xs,
    },
    underlineLight: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginTop: Spacing.sm,
    },
    submitButtonContainer: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    submitButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    infoGroup: {
        marginBottom: Spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 16,
    },
    avatarSelectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
    },
    avatarOption: {
        padding: 4,
        backgroundColor: Colors.white,
        borderRadius: 60,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectionImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    orText: {
        marginHorizontal: Spacing.sm,
    }
});
