/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Spacing = {
    small: 8,
    medium: 16,
    large: 24
}

export const fontSizes = {
    small: 14,
    medium: 18,
    large: 24
}

export const formTitle = {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  }

export const formContainer = { flex: 1, justifyContent: "center", alignItems: "center" }
export const text = { fontSize: 20, marginBottom: 20 }
export const form = {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  }
export const formInput = {
    // margin: 8,
    // padding: 8,
    // gap: 16,
    fontSize: 16
  }
  
export const formSurface = {
    padding: 8,
    backgroundColor: 'white',
    // margin: 8
  }
export const formSurfaceContainer = {
    padding: 16,
    backgroundColor: 'rgba(56,185,255,0.3)'
  }
export const formSurfaceMetaContainer = {
    backgroundColor: 'rgba(55,255,55,0.4)',
    width:350
  }
export const formSubtitle = {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  }
export const formmeasurementBox = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8, // space between inputs (RN 0.71+)
  paddingHorizontal: 8,
}

export const formMeasurementInput = {
  flex: 1,          // take equal space
  minWidth: 120,    // never smaller than 120px
  maxWidth: 180,    // optional: never bigger than 180px
}

export const formMeasurementContainer = {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  }
export const formItem = {
    width: "30%",        // 3 items per row
    aspectRatio: 1,      // makes it square
    marginBottom: 10,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  }
export const formMeasurementText = {
    color: "white",
    fontWeight: "bold",
  }
export const formMeasurementFloatInput = {
    width: 144
  }