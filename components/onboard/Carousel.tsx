import React, { useState, useRef } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface CarouselProps {
    children: React.ReactNode[];
    showPagination?: boolean;
    onPageChange?: (index: number) => void;
    currentIndex?: number;
}

export default function Carousel({
    children,
    showPagination = true,
    onPageChange,
    currentIndex
}: CarouselProps) {
    const { currentTheme } = React.useContext(ThemeContext);

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);7

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);

        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
            onPageChange && onPageChange(newIndex);
        }
    };

    const scrollToIndex = (index: number) => {
        scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    };

    React.useEffect(() => {
        if (
            typeof currentIndex === 'number' &&
            currentIndex !== activeIndex
        ) {
            scrollToIndex(currentIndex);
        }
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
                accessibilityLabel="Carousel of onboarding slides"
                accessibilityHint='Swipe left or right to navigate through the slides'
            >
                {children.map((child, index) => (
                    <View key={index} style={styles.slide}>
                        {child}
                    </View>
                ))}
            </ScrollView>

            {showPagination && (
                <View style={styles.pagination}>
                    {children.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === activeIndex && (currentTheme === 'light' ? styles.paginationDotActive : { backgroundColor: Colors.white })
                            ]}
                            onTouchEnd={() => scrollToIndex(index)}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.accent,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
});