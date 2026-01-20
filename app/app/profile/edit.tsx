import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Edit2 } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';
import { useAuth } from '@/store/AuthContext';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateProfile, uploadProfileImage } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

    // Sync form fields with user data when screen focuses or user changes
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                const nameParts = user.name?.split(' ') || [];
                setFirstName(nameParts[0] || '');
                setLastName(nameParts.slice(1).join(' ') || '');
                setMobile(user.phone || '');
                setEmail(user.email || '');
                setSelectedImageUri(null); // Reset image selection when screen opens
            }
        }, [user])
    );

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0]) {
                const pickedUri = result.assets[0].uri;
                setSelectedImageUri(pickedUri);
                
                // Upload image immediately
                setUploadingImage(true);
                const res = await uploadProfileImage(pickedUri);
                setUploadingImage(false);

                if (res.success) {
                    // Image uploaded and saved - selectedImageUri will show the local preview
                    // user.avatar will be updated in context, so when we navigate back it shows correctly
                } else {
                    setSelectedImageUri(null);
                    Alert.alert('Error', res.message || 'Failed to upload image');
                }
            }
        } catch (error) {
            console.error('Pick image error:', error);
            setUploadingImage(false);
            setSelectedImageUri(null);
            Alert.alert('Error', 'Failed to pick image');
        }
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

    // Determine which image to show: selected local image > uploaded avatar > default
    const displayImageUri = selectedImageUri || user?.avatar || null;

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
                    headerRight: () => <View />,
                }}
            />

            <View style={styles.headerBackground} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileImageContainer}>
                    <View style={styles.imageWrapper}>
                        <TouchableOpacity 
                            onPress={handlePickImage} 
                            activeOpacity={0.9} 
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <View style={[styles.profileImage, styles.loadingContainer]}>
                                    <ActivityIndicator size="small" color={Colors.primary} />
                                </View>
                            ) : displayImageUri ? (
                                <Image
                                    source={{ uri: displayImageUri }}
                                    style={styles.profileImage}
                                    contentFit="cover"
                                    cachePolicy="none"
                                    key={displayImageUri}
                                />
                            ) : (
                                <View style={[styles.profileImage, styles.defaultAvatarContainer]}>
                                    <AppText variant="h2" weight="bold" color={Colors.white}>
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AppText>
                                </View>
                            )}
                            {!uploadingImage && (
                                <View style={styles.editIconContainer}>
                                    <Edit2 size={16} color={Colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.borderLight,
    },
    defaultAvatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
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
    submitButtonContainer: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    submitButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
});
