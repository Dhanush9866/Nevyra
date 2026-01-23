import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, Shield, FileText, Scale } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        marginLeft: Spacing.sm,
    },
    header: {
        padding: Spacing.xl,
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...Colors.shadow.sm,
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 24,
        marginBottom: Spacing.xs,
        color: Colors.text,
    },
    divider: {
        width: 32,
        height: 3,
        backgroundColor: Colors.primary,
        borderRadius: 2,
        marginVertical: Spacing.sm,
    },
    subtitle: {
        lineHeight: 20,
        paddingHorizontal: Spacing.lg,
    },
    sectionsContainer: {
        padding: Spacing.md,
        marginTop: Spacing.sm,
    },
    sectionWrapper: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        ...Colors.shadow.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    iconBoxActive: {
        backgroundColor: '#F5F3FF',
    },
    sectionText: {
        fontSize: 15,
    },
    expandedContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        paddingLeft: Spacing.lg + 36 + Spacing.md, // Align with text after icon
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    sectionContent: {
        marginTop: Spacing.sm,
    },
    bulletPoint: {
        marginBottom: Spacing.sm,
        lineHeight: 20,
        fontSize: 14,
    },
    paragraph: {
        marginBottom: Spacing.md,
        lineHeight: 22,
        fontSize: 14,
    },
    footer: {
        padding: Spacing.xl,
        alignItems: 'center',
    },
    bottomPadding: {
        height: 40,
    },
});

type Section = {
    title: string;
    icon: any;
    content: React.ReactNode;
};

const TERMS_SECTIONS: Section[] = [
    {
        title: 'Platform Overview',
        icon: FileText,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Zythova is an e-commerce marketplace platform that connects buyers and sellers.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Zythova is not the owner of seller-listed products unless explicitly stated.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • We provide a secure environment for transactions between verified sellers and customers.
                </AppText>
            </View>
        ),
    },
    {
        title: 'User Responsibilities',
        icon: Shield,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Users must provide accurate and complete registration information.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • You are solely responsible for maintaining the confidentiality of your account credentials.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Any unauthorized use of your account must be reported to Zythova immediately.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Users must not engage in fraudulent activities or violate any intellectual property rights.
                </AppText>
            </View>
        ),
    },
    {
        title: 'Orders & Payments',
        icon: FileText,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Orders are officially confirmed only after successful payment authorization.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • All prices, availability, and specific offers are subject to change as defined by sellers.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Zythova acts as a facilitator and is not responsible for external payment gateway failures.
                </AppText>
            </View>
        ),
    },
    {
        title: 'Shipping & Delivery',
        icon: FileText,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Delivery timelines provided are estimates based on location and logistics partner data.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Providing incorrect or incomplete address details may lead to delivery failure and additional charges.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Delays caused by natural disasters, strikes, or major logistics issues are outside Zythova’s control.
                </AppText>
            </View>
        ),
    },
    {
        title: 'Returns & Refunds',
        icon: Scale,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Return eligibility is determined by the specific product category and seller’s individual policy.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Successful refunds are processed back to the original payment method used during checkout.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Systematic abuse of the return policy may lead to temporary or permanent account suspension.
                </AppText>
            </View>
        ),
    },
    {
        title: 'Privacy & Data Security',
        icon: Shield,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.paragraph}>
                    Zythova values your privacy and is committed to protecting your personal information. We collect data such as your name, mobile number, and address strictly to facilitate order fulfillment.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.paragraph}>
                    We do not sell, rent, or trade your personal data with third-party marketers. Data is only shared with verified logistics and payment partners as necessary for service delivery.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.paragraph}>
                    Your financial information is never stored on our servers; it is handled by PCI-DSS compliant secure payment gateways.
                </AppText>
            </View>
        ),
    },
    {
        title: 'Licenses & IP',
        icon: Scale,
        content: (
            <View style={styles.sectionContent}>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • All Zythova platform content, including logos, designs, and software, is the property of Zythova.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Users are granted a limited, non-exclusive license to access and use the platform for personal shopping.
                </AppText>
                <AppText variant="body" color={Colors.textSecondary} style={styles.bulletPoint}>
                    • Unauthorized reproduction or distribution of platform assets is strictly prohibited and subject to legal action.
                </AppText>
            </View>
        ),
    },
];

export default function TermsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [expandedSection, setExpandedSection] = useState<number | null>(0);

    const toggleSection = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Terms & Policies',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </TouchableOpacity>
                    ),
                    headerStyle: {
                        backgroundColor: Colors.white,
                    },
                    headerShadowVisible: false,
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={[styles.header, { width }]}>
                    <View style={styles.headerIconContainer}>
                        <Scale size={32} color={Colors.primary} />
                    </View>
                    <AppText variant="h2" weight="bold" style={styles.title}>
                        Terms of Services
                    </AppText>
                    <View style={styles.divider} />
                    <AppText variant="body" color={Colors.textSecondary} align="center" style={styles.subtitle}>
                        Last updated: January 2026. By using the Zythova app, you agree to these legal terms.
                    </AppText>
                </View>

                <View style={styles.sectionsContainer}>
                    {TERMS_SECTIONS.map((section, index) => (
                        <View key={index} style={styles.sectionWrapper}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => toggleSection(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.sectionTitleRow}>
                                    <View style={[styles.iconBox, expandedSection === index && styles.iconBoxActive]}>
                                        <section.icon size={18} color={expandedSection === index ? Colors.primary : Colors.textSecondary} />
                                    </View>
                                    <AppText
                                        variant="body"
                                        weight="bold"
                                        color={expandedSection === index ? Colors.primary : Colors.text}
                                        style={styles.sectionText}
                                    >
                                        {section.title}
                                    </AppText>
                                </View>
                                {expandedSection === index ? (
                                    <ChevronUp size={20} color={Colors.primary} />
                                ) : (
                                    <ChevronDown size={20} color={Colors.textLight} />
                                )}
                            </TouchableOpacity>
                            {expandedSection === index && (
                                <View style={styles.expandedContent}>
                                    {section.content}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <AppText variant="caption" color={Colors.textSecondary} align="center">
                        © {new Date().getFullYear()} Zythova Marketplace.
                    </AppText>
                    <AppText variant="caption" color={Colors.textLight} align="center" style={{ marginTop: Spacing.xs }}>
                        All rights reserved. Governing Law: India.
                    </AppText>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}
