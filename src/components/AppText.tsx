import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text as NativeText, TextProps, TextStyle } from 'react-native';

type Weight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

const bodyFonts: Record<Weight, string> = {
  '100': 'DMSans_100Thin',
  '200': 'DMSans_200ExtraLight',
  '300': 'DMSans_300Light',
  '400': 'DMSans_400Regular',
  '500': 'DMSans_500Medium',
  '600': 'DMSans_600SemiBold',
  '700': 'DMSans_700Bold',
  '800': 'DMSans_800ExtraBold',
  '900': 'DMSans_900Black',
  normal: 'DMSans_400Regular',
  bold: 'DMSans_700Bold',
};

const italicFonts: Record<Weight, string> = {
  '100': 'DMSans_100Thin_Italic',
  '200': 'DMSans_200ExtraLight_Italic',
  '300': 'DMSans_300Light_Italic',
  '400': 'DMSans_400Regular_Italic',
  '500': 'DMSans_500Medium_Italic',
  '600': 'DMSans_600SemiBold_Italic',
  '700': 'DMSans_700Bold_Italic',
  '800': 'DMSans_800ExtraBold_Italic',
  '900': 'DMSans_900Black_Italic',
  normal: 'DMSans_400Regular_Italic',
  bold: 'DMSans_700Bold_Italic',
};

export function AppText({ style, ...props }: TextProps) {
  const resolvedStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = resolvedStyle?.fontWeight ?? '400';
  const fontWeight = (weight in bodyFonts ? weight : '400') as Weight;
  const fontFamily = resolvedStyle?.fontFamily
    ?? (resolvedStyle?.fontStyle === 'italic' ? italicFonts[fontWeight] : bodyFonts[fontWeight]);

  return <NativeText {...props} style={[{ fontFamily }, style]} />;
}

export function DisplayText({ children, style, ...props }: TextProps & { children?: ReactNode }) {
  return (
    <AppText
      {...props}
      style={[{ fontFamily: 'PlayfairDisplay_600SemiBold' }, style]}
    >
      {children}
    </AppText>
  );
}
