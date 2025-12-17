import * as Form from '@custom/react-native-forms/src'
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { VendorFormStateContext } from 'src/context/FormContext';


export default function NewVendorForm() {
    const vendor = useContext(VendorFormStateContext)

    return(

        <LinearGradient
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.5, y: 0.9 }}
            colors={['#0f8', '#80f', '#f80']}
            style={{ padding: 16, borderRadius: 4, margin: 4}}
        >
            <Form.Control name="vendor_form" label="New Vendor" labelStyle={styles.headerLaber}>
                <View style={styles.container}>
                
                    <Form.Control
                        name='vendorName'
                        label='Vendor Name'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={vendor.name}
                            onChangeText={vendor.setName}
                        />
                    </Form.Control>
                    
                    <Form.Control
                        name='vendorEmail'
                        label='Vendor Email'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={vendor.email}
                            onChangeText={vendor.setEmail}
                            
                        />
                    </Form.Control>
                    
                    <Form.Control
                        name='vendorPhone'
                        label='Vendor Phone'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={vendor.phone}
                            onChangeText={vendor.setPhone}
                        />
                    </Form.Control>
                    
                    <Form.Control
                        name='vendorAddress'
                        label='Vendor Name'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={vendor.address}
                            onChangeText={vendor.setAddress}
                            multiline
                        />
                    </Form.Control>
                    
                    <Form.Control
                        name='vendorContact'
                        label='Vendor Contact Name'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }} 
                            value={vendor.contactName}
                            onChangeText={vendor.setContactName}
                        />
                    </Form.Control>
                    <Form.Control
                        name='vendorWebsite'
                        label='Vendor Website'
                        labelStyle={}
                    >
                        <Form.Input
                            style={{ backgroundColor: 'transparent', width: '100%' }}
                            value={vendor.website}
                            onChangeText={vendor.setWebsite}
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