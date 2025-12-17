// export const COLORS

import { FlexStyle, TextStyle } from "react-native"

type PaddingSize = 'SM' | 'MD' | 'LG';

export const CONTAINER = {
     FULL: {
          flex: 1
     },
     
}

export const PADDING = {
     SM: {
          padding: 8
     },
     MD: {
          padding: 16
     },
     LG: {
          padding: 32     
     },
}  satisfies Record<PaddingSize, FlexStyle>

type STYLES = TextStyle | FlexStyle

export const FORM = {
     LABEL: {
          fontSize: 18,
          textAlign:  'center',
          fontWeight: 'bold',
          color: 'red',
          textShadowColor: 'blue',
          textShadowRadius: 16,
     }
} satisfies Record<string, STYLES>