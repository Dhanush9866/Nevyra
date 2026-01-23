import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react-native';
import AppText from '@/components/atoms/AppText';
import Colors from '@/constants/colors';
import Spacing from '@/constants/spacing';

type FAQ = {
    question: string;
    answer: string;
};

const FAQS: FAQ[] = [
    {
        question: 'How long does shipping take?',
        answer: 'Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders. Express options are available at checkout.',
    },
    {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Please visit our Returns section for more details.',
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.',
    },
    {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a confirmation notification with a tracking number. You can also view tracking information in your account under "Orders".',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, Amex), UPI, and Cash on Delivery (COD) for eligible locations.',
    },
    {
        question: 'How do I cancel my order?',
        answer: 'You can cancel your order within 2 hours of placing it, provided it hasn’t been shipped. Go to "My Orders", select the order, and look for the cancel button.',
    },
];

export default function FAQScreen() {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Frequently Asked Questions',
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
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Search size={32} color={Colors.primary} />
                    </View>
                    <AppText variant="h2" weight="bold" style={styles.title}>
                        How can we help?
                    </AppText>
                    <AppText variant="body" color={Colors.textSecondary} align="center" style={styles.subtitle}>
                        Find answers to common questions below.
                    </AppText>
                </View>

                <View style={styles.faqList}>
                    {FAQS.map((faq, index) => (
                        <View key={index} style={styles.faqWrapper}>
                            <TouchableOpacity
                                style={styles.faqHeader}
                                onPress={() => toggleFAQ(index)}
                                activeOpacity={0.7}
                            >
                                <AppText
                                    variant="body"
                                    weight="semibold"
                                    style={[styles.question, expandedIndex === index && { color: Colors.primary }]}
                                >
                                    {faq.question}
                                </AppText>
                                {expandedIndex === index ? (
                                    <ChevronUp size={20} color={Colors.primary} />
                                ) : (
                                    <ChevronDown size={20} color={Colors.textLight} />
                                )}
                            </TouchableOpacity>
                            {expandedIndex === index && (
                                <View style={styles.faqAnswer}>
                                    <AppText variant="body" color={Colors.textSecondary} style={styles.answerText}>
                                        {faq.answer}
                                    </AppText>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.contactSection}>
                    <AppText variant="body" weight="bold" style={styles.contactTitle}>
                        Still have questions?
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary} align="center" style={styles.contactSubtitle}>
                        If you can't find the answer you're looking for, please contact our support team.
                    </AppText>
                    <TouchableOpacity style={styles.contactButton}>
                        <MessageCircle size={18} color={Colors.white} />
                        <AppText variant="body" weight="bold" color={Colors.white} style={{ marginLeft: 8 }}>
                            Contact Support
                        </AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

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
        paddingTop: Spacing.md,
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...Colors.shadow.sm,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0E6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 24,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        lineHeight: 20,
    },
    faqList: {
        padding: Spacing.md,
        marginTop: Spacing.sm,
    },
    faqWrapper: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        ...Colors.shadow.sm,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    question: {
        flex: 1,
        paddingRight: Spacing.sm,
        fontSize: 15,
    },
    faqAnswer: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    answerText: {
        lineHeight: 22,
        fontSize: 14,
    },
    contactSection: {
        marginTop: Spacing.md,
        marginHorizontal: Spacing.md,
        padding: Spacing.xl,
        backgroundColor: '#F0E6FF',
        borderRadius: 24,
        alignItems: 'center',
    },
    contactTitle: {
        fontSize: 18,
        marginBottom: Spacing.xs,
    },
    contactSubtitle: {
        marginBottom: Spacing.lg,
        lineHeight: 18,
    },
    contactButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        ...Colors.shadow.md,
    },
    bottomPadding: {
        height: 40,
    },
});
