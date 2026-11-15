import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export function BoardIllustration({ width = 136, height = 82 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 190" fill="none">
      <Defs>
        <LinearGradient id="wood" x1="20" y1="12" x2="300" y2="175" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D6B67E" />
          <Stop offset="1" stopColor="#9A6E43" />
        </LinearGradient>
        <LinearGradient id="board" x1="42" y1="30" x2="278" y2="155" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F4E8CC" />
          <Stop offset="1" stopColor="#E6D3AB" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="160" cy="169" rx="137" ry="12" fill="#061B13" fillOpacity=".28" />
      <Path d="M37 24c0-9 7-16 16-16h214c9 0 16 7 16 16v119l-22 17H57l-20-17V24Z" fill="#735032" />
      <Rect x="20" y="12" width="280" height="140" rx="21" fill="url(#wood)" />
      <Rect x="30" y="22" width="260" height="120" rx="16" stroke="#E8D3A7" strokeOpacity=".78" strokeWidth="2" />
      <Rect x="47" y="35" width="226" height="94" rx="11" fill="url(#board)" />
      <Rect x="53" y="41" width="214" height="82" rx="9" stroke="#9B7049" strokeOpacity=".52" strokeWidth="2" />
      <Circle cx="57" cy="47" r="13" fill="#244232" />
      <Circle cx="263" cy="47" r="13" fill="#244232" />
      <Circle cx="57" cy="117" r="13" fill="#244232" />
      <Circle cx="263" cy="117" r="13" fill="#244232" />
      <Circle cx="160" cy="82" r="24" stroke="#A47A4D" strokeOpacity=".65" strokeWidth="2" />
      <Circle cx="160" cy="82" r="7" fill="#9A4739" />
      <Circle cx="146" cy="70" r="7" fill="#F7F1E4" stroke="#B79D70" strokeWidth="1.5" />
      <Circle cx="175" cy="72" r="7" fill="#262A28" stroke="#B79D70" strokeWidth="1.5" />
      <Circle cx="147" cy="95" r="7" fill="#262A28" stroke="#B79D70" strokeWidth="1.5" />
      <Circle cx="178" cy="94" r="7" fill="#F7F1E4" stroke="#B79D70" strokeWidth="1.5" />
      <Ellipse cx="225" cy="103" rx="10" ry="8" fill="#D6B67E" />
      <Ellipse cx="225" cy="103" rx="6" ry="4" fill="#F5E9CE" />
      <Path d="M85 58a18 18 0 0 0-18 18m0 12a18 18 0 0 0 18 18m150-48a18 18 0 0 1 18 18m0 12a18 18 0 0 1-18 18" stroke="#9A4739" strokeOpacity=".63" strokeWidth="2" strokeLinecap="round" />
      <Path d="M67 52h12m-18 6v12m180-18h12m6 6v12M67 112v12m6 6h12m162-18v12m-6 6h-12" stroke="#F0DBB3" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
