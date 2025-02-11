/**
 * Colors configuration for the app. 
 * Primary color: Colors.primaryColor, Secondary color: #f1c40f, White: #f5f5f5
 */

const primaryColor = '#27ae60';
const secondaryColor = '#f1c40f';
const whiteColor = '#f5f5f5';
const greenText = '#2e7d32';
const lightGreen = '#d3e4cd';
const greyText = '#777';
const locked = '#BDC3C7';
const warning = '#EED202';
const negativeRed = '#e74c3c';

export const Colors = {
  light: {
    text: '#11181C',
    background: whiteColor,
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
  },
  dark: {
    text: '#ECEDEE', // Keeping text color for dark mode
    background: '#151718', // Keeping dark background for dark mode
    tint: primaryColor, // Use primary color for dark mode as well
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColor, // Use primary color for selected tab
  },
  primaryColor,
  secondaryColor,
  whiteColor,
  greenText,
  lightGreen,
  greyText,
  locked,
  warning,
  negativeRed
};
