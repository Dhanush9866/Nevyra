export default {
  fontSizes: {
    xs: 10,
    sm: 11,
    base: 13,
    lg: 15, // Reduced slightly or kept similar
    xl: 16, // Reduced
    '2xl': 18, // Reduced from 20
    '3xl': 21, // Reduced from 24
    '4xl': 24, // Reduced from 28
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
