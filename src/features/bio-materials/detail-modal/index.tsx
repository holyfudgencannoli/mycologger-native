import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as PurchLogs from '@db/purchase-logs'
import { useSQLiteContext } from "expo-sqlite";

interface PurchaseLogData {
    id: number;
    brand: string;
    log_date: string;
    purchase_date: string;
    purchase_amount: number;
    purchase_unit: string;
    cost: number;
    notes: string;
    receipt_entry_id: number;
    inventory_log_id: number;
    item_id: number;
    vendor_id: number;
    user_id: number;
}




const DetailModal = ({ visible, setModalOpen, item}) => {
    const [purchaseLogs, setPurchaseLogs] = useState<any>();
    const db = useSQLiteContext();

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    const getLogs = async() => {
        const logs = await PurchLogs.readAll(db, 'bio_materials')
        setPurchaseLogs(logs)

    }

    useFocusEffect(
        useCallback(() => {
            setPurchaseLogs(item? item.purchase_logs : [])
        }, [])
    )

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
                    <FlatList
                        data={item? item.purchase_logs : []}
                        keyExtractor={(item) => item.id} // Use a unique key for each item
                        renderItem={({ item }) => (
                            <View style={styles.logItem}>
                                <Text>{item.date}</Text>
                                <Text>{item.supplier}</Text>
                                <Text>{item.material}</Text>
                                <Text>${item.price.toFixed(2)}</Text>
                                {item.notes && <Text>{item.notes}</Text>}
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

export default DetailModal;
        
