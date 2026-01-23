import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    LayoutChangeEvent,
} from 'react-native';
import { ArrowRight, ShoppingCart } from 'lucide-react-native';
import AppText from '../atoms/AppText';
import Colors from '@/constants/colors';

interface SlideToActButtonProps {
    onComplete: () => void;
    width?: number;
    height?: number;
    unlockedText?: string;
    lockedText?: string;
}

const SlideToActButton = ({
    onComplete,
    width = 280,
    height = 56,
    unlockedText = 'Redirecting...',
    lockedText = 'Slide to Shop',
}: SlideToActButtonProps) => {
    const [containerWidth, setContainerWidth] = useState(width);
    const BUTTON_SIZE = height - 8; // Padding 4 on each side
    const SWIPE_THRESHOLD = containerWidth - BUTTON_SIZE - 20;

    const pan = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const [completed, setCompleted] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !completed,
            onMoveShouldSetPanResponder: () => !completed,
            onPanResponderMove: (_, gestureState) => {
                if (completed) return;

                // Limit movement [0, MAX_DRAG]
                let newX = gestureState.dx;
                const maxDrag = containerWidth - BUTTON_SIZE - 8;

                if (newX < 0) newX = 0;
                if (newX > maxDrag) newX = maxDrag;

                pan.setValue({ x: newX, y: 0 });

                // Fade out text as we drag
                const opacityVal = 1 - newX / maxDrag;
                opacity.setValue(opacityVal);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (completed) return;

                const maxDrag = containerWidth - BUTTON_SIZE - 8;

                if (gestureState.dx > maxDrag * 0.8) {
                    // Success threshold reached
                    setCompleted(true);

                    Animated.timing(pan, {
                        toValue: { x: maxDrag, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        onComplete();
                        // Reset after a delay if needed, but usually we navigate away
                    });

                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();

                } else {
                    // Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,
                    }).start();

                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View
            style={[
                styles.container,
                { width, height, backgroundColor: completed ? Colors.success : '#E0E0E0' }
            ]}
            onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            <View style={styles.backgroundContent}>
                <Animated.View style={{ opacity }}>
                    <AppText weight="bold" style={styles.text}>
                        {lockedText}
                    </AppText>
                </Animated.View>

                {!completed && (
                    <View style={styles.arrows}>
                        <ArrowRight size={16} color="#A0A0A0" style={{ opacity: 0.5 }} />
                        <ArrowRight size={16} color="#808080" style={{ marginLeft: -10, opacity: 0.8 }} />
                        <ArrowRight size={16} color="#606060" style={{ marginLeft: -10 }} />
                    </View>
                )}
            </View>

            {completed && (
                <View style={styles.unlockedContent}>
                    <AppText weight="bold" color={Colors.white}>
                        {unlockedText}
                    </AppText>
                </View>
            )}

            <Animated.View
                style={[
                    styles.thumb,
                    {
                        height: BUTTON_SIZE,
                        width: BUTTON_SIZE,
                        transform: [{ translateX: pan.x }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <ShoppingCart size={24} color={Colors.white} />
                {/* Pulse effect circle could be added here */}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        marginTop: 24,
        ...Colors.shadow.sm,
    },
    backgroundContent: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 40, // Offset for the thumb
    },
    unlockedContent: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumb: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        ...Colors.shadow.md,
        zIndex: 10,
    },
    text: {
        color: '#757575',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    arrows: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
    },
});

export default SlideToActButton;
