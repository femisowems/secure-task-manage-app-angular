// Tailwind v4 is primarily CSS-driven, but we export these tokens
// for use in components or JS-based styling if needed.
import { TOKENS } from './tokens';

export default {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            spacing: TOKENS.SPACING.scale,
            borderRadius: TOKENS.RADIUS,
            colors: TOKENS.COLORS,
        },
    },
};
