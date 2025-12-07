import RawMaterial from '@features/raw-materials/types/raw-material';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as RawMat from '@db/raw-materials'
import * as PurchLogs from '@db/purchase-logs'
import * as InvLogs from '@db/inventory-logs'
import * as InvItems from '@db/inventory-items'
import * as Vendor from '@db/vendors'
import { useSQLiteContext } from 'expo-sqlite';
import { PurchaseLogProp } from '../types/purchase-log';
import Button from '@components/button';


export const RawMaterialsPurchaseLogModal = ({ visible, setModalOpen, item}: {visible: boolean, setModalOpen: (arg0: boolean) => void, item: RawMaterial}) => {
    const [purchaseLogs, setPurchaseLogs] = useState<{ log: PurchaseLogProp, vendor: Vendor.VendorType  }[]>([]);
    const [rawMaterial, setRawMaterial] = useState<RawMaterial>();
    const [vendors, setVendors] = useState([]);
    const db = useSQLiteContext();

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    const getPurchaseLogs = async() => {
        const logs = await PurchLogs.getByItemId(db, 'raw_material', item.id)
        const material = await RawMat.getById(db, item.item_id)
        const vendorAddedLogs: {log: PurchaseLogProp, vendor: Vendor.VendorType}[] = []            
        for (let i = 0; i < logs.length; i++) {
            const current = logs[i];
            const vendorId = current.vendor_id
            const vendor: Vendor.VendorType = await Vendor.getById(db, vendorId)
            vendorAddedLogs.push({log: {...current}, vendor: {...vendor}})
        }
        setPurchaseLogs(vendorAddedLogs)
        setRawMaterial(material)

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
                        await RawMat.destroy(db, id)
                        await InvItems.destroy
                        // Remove the item from state
                        setTimes((prev) => prev.filter((t) => t.id !== id));
            
                        /* OPTIONAL: If you want to persist immediately (instead of waiting for the effect),
                        uncomment the line below.  The effect will still run, but it’s harmless. */
                        persistTimes(times.filter(t => t.id !== id));
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
                        <FlatList
                            data={purchaseLogs}
                            keyExtractor={(purchaseLog) => purchaseLog.log.id.toString()} // Use a unique key for each item
                            renderItem={({ item }) => (

                                <View style={styles.logItem}>
                                    <Text>{item.log.purchase_date}</Text>
                                    <Text>{item.vendor.name}</Text>
                                    <Text>{rawMaterial.name}</Text>
                                    <Text>${item.log.cost.toFixed(2)}</Text>
                                    {item.log.notes && <Text>{item.log.notes}</Text>}
                            

                                    <View style={{ flexDirection: 'row', width: '100%', padding: 16, justifyContent: 'space-evenly' }}>
                                        <Button
                                            title="Delete"
                                            color="#d32f2f"          // red – feel free to change
                                            onPress={() => handleDelete(item.log.id)}
                                        />
                                        {/* Navigation button */}
                                        <Button
                                            title="Execute"
                                            onPress={() => goToScreen(item)}
                                            color="#4CAF50"
                                        />
                                    </View>
                                </View>

                            )}
                        />
                    
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

export default RawMaterialsPurchaseLogModal;
        
