import Itemerial from '@features/raw-materials/types/raw-material';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Item from '@db/items'
import * as PurchLogs from '@db/purchase-logs'
import * as Vendor from '@db/vendors'
import { useSQLiteContext } from 'expo-sqlite';
import { PurchaseLogProp } from '../types/purchase-log';
import Button from '@components/button';
import { ItemProps } from '@db/items/types';
import { PurchaseLogData } from '@db/purchase-logs/types';
import { LinearGradient } from 'expo-linear-gradient';


export const PurchaseLogsModal = ({ visible, setModalOpen, item}: {visible: boolean, setModalOpen: (arg0: boolean) => void, item: ItemProps}) => {
    const [purchaseLogs, setPurchaseLogs] = useState<{ item: ItemProps, log: PurchaseLogData, vendor: Vendor.VendorType  }[]>([]);
    const [vendors, setVendors] = useState([]);
    const db = useSQLiteContext();

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    const getPurchaseLogs = async() => {
        const logs = await PurchLogs.getByItemId(db, 'raw_material', item.id)
        const material = await Item.getById(db, item.id)
        const vendorAddedLogs: {item: ItemProps, log: PurchaseLogData, vendor: Vendor.VendorType}[] = []            
        for (let i = 0; i < logs.length; i++) {
            const current = logs[i];
            const vendorId = current.vendor_id
            const vendor: Vendor.VendorType = await Vendor.getById(db, vendorId)
            vendorAddedLogs.push({ item: {...item}, log: {...current}, vendor: {...vendor}})
        }
        setPurchaseLogs(vendorAddedLogs)

    }

    useFocusEffect(
        useCallback(() => {
            getPurchaseLogs()
        }, [])
    )

    
        const handleDelete = (id: number) => {
            Alert.alert(
                "Delete entry",
                "Are you sure you want to remove this time record?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                    text: "Delete",
                    style: "destructive",
                    onPress: async() => {
                        await Item.destroy(db, id)
                    },
                    },
                ],
                { cancelable: true }
            );
        };
            
            

    return (
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Purchase Logs</Text>
                    <Text>Purchase logs will appear below</Text>
                    {purchaseLogs.map((item) => {
                        return(
                            <View style={styles.logItem}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0.3, y: 0.9 }}
                                    colors={['#94F8', '#00f', '#057']}
                                    style={{ flexDirection: 'column', padding: 16, borderRadius: 4, width: '75%' }}
                                >
                                    <Text style={styles.text}>{new Date(item.log.purchase_date).toLocaleDateString('en-GB',{
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</Text>
                                    <Text style={styles.text}>{new Date(item.log.purchase_date).toLocaleTimeString()}</Text>
                                    <Text style={styles.text}>{item.vendor.name}</Text>
                                    <Text style={styles.text}>{item.item.name}</Text>
                                    <Text style={styles.text}>${item.log.cost.toFixed(2)}</Text>
                                    {/* {item.log.notes && <Text>{item.log.notes}</Text>} */}

                                    
                                </LinearGradient>
                                <Button
                                viewStyle={{ margin: 'auto' }}
                                    title="Delete"
                                    color="#d32f2f"          // red – feel free to change
                                    onPress={() => handleDelete(item.log.id)}
                                />
                            </View>
                        )
                    })}
                    
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Take up full screen space
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    text: {
        color: 'white'
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default PurchaseLogsModal;
        
