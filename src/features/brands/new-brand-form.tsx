import * as Form from '@custom/react-native-forms/src'
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { BrandFormStateContext } from 'src/context/FormContext';
import { FORM } from "@constants/styles";


export default function NewBrandForm() {
    const {
        brandName, setBrandName,
        brandWebsite, setBrandWebsite
    } = useContext(BrandFormStateContext)

    return(

        <LinearGradient
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.5, y: 0.9 }}
            colors={['#0f8', '#80f', '#f80']}
            style={{ padding: 16, borderRadius: 4, margin: 4}}
        >
            <Form.Control name="brand_form" label="New Brand" labelStyle={styles.headerLaber}>
                <View style={styles.container}>
                
                    <Form.Control
                        name='brandName'
                        label='Brand Name'
                        labelStyle={styles.label}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={brandName}
                            onChangeText={setBrandName}
                        />
                    </Form.Control>
                    <Form.Control
                        name='brandWebsite'
                        label='Brand Website'
                        labelStyle={styles.label}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }}
                            value={brandWebsite}
                            onChangeText={setBrandWebsite}
                        />
                    </Form.Control>
                </View>

            </Form.Control>
        </LinearGradient>
    )
}


const styles = StyleSheet.create({
    container: { flex: 1, borderRadius: 8  },
    headerLaber:{
        fontSize: 24,
        textAlign:  'center',
        fontWeight: 'bold',
        color: 'red',
        textShadowColor: 'black',
        textShadowRadius: 16,
    },
    label: {
        fontSize: 18,
        textAlign:  'center',
        fontWeight: 'bold',
        color: 'red',
        textShadowColor: 'black',
        textShadowRadius: 16,
    },

});