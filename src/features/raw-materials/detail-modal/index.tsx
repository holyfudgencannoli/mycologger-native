import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as PurchLog from '@db/purchase-logs'
import { useSQLiteContext } from 'expo-sqlite';
import { PurchaseLogData } from '@db/purchase-logs/types';





const DetailModal = ({ visible, setModalOpen, item}) => {
    const [purchaseLogs, setPurchaseLogs] = useState<PurchaseLogData[]>([]);
    const db = useSQLiteContext()

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    async function getData() {
        const logs: PurchaseLogData[] = await PurchLog.getAllByType(db, 'raw_material')
        console.log(logs)
        setPurchaseLogs(logs)
    }

    useFocusEffect(
        useCallback(() => {
            getData()
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
                        data={purchaseLogs ? purchaseLogs : []}
                        keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
                        renderItem={({ item }) => (
                            <View style={styles.logItem}>
                                <Text>{item.purchase_date}</Text>
                                {/* <Text>{item.supplier}</Text> */}
                                <Text>{item.item_id}</Text>
                                <Text>${item.cost.toFixed(2)}</Text>
                                {/* {item.notes && <Text>{item.notes}</Text>} */}
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
        
