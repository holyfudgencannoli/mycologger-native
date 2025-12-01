import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as cnv from '@utils/unitConversion'

interface RecipeData {
    id: number;
    name: string;
    ingredients: JSON;
}


const RecipeModal = ({ visible, setModalOpen, item}) => {
    const [ingredients, setIngredients] = useState([]);

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    useFocusEffect(
        useCallback(() => {
            setIngredients(JSON.parse(item.ingredients))
            console.log(JSON.parse(item.ingredients))
        }, [])
    )

    return(
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Recipes</Text>
                    <FlatList

                        data={ingredients}
                        keyExtractor={(ing) => ing.ingredientId} // Use a unique key for each item
                        renderItem={({ item }: {item: {amount: number, ingredientId: number, ingredientName: string, unit: string}}) => (
                            <View style={styles.logItem}>
                                <Text>
                                    {item.ingredientName} -- {cnv.convertFromBase({value: item.amount, to: item.unit.toLowerCase()})} {item.unit}
                                </Text>
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
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

export default RecipeModal;
        
