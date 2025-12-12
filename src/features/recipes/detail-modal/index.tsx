import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as cnv from '@utils/unitConversion'
import { LinearGradient } from 'expo-linear-gradient';

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
        <View style={styles.modalContainer} >

            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.3, y: 0.9 }}
                    colors={['#f4F8', '#00fc', '#0578']}
                    style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: '20%', padding: 16, borderRadius: 4, height: '25%', width: '72%', justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>{item.name}</Text>
                        <FlatList
                            data={ingredients}
                            keyExtractor={(ing) => ing.ingredientId} // Use a unique key for each item
                            renderItem={({ item, }: {item: {amount: number, ingredientId: number, ingredientName: string, unit: string}}) => (
                                <View style={styles.logItem}>
                                    <Text style={styles.logItemText} >
                                        {item.ingredientId}: {cnv.convertFromBase({value: item.amount, to: item.unit.toLowerCase()})} {item.unit} of {item.ingredientName}
                                    </Text>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
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
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 12,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 'auto',
        color: 'white'
    },
    logItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 8,
        // borderBottomWidth: 1,
        // borderBottomColor: '#000',
    },
    logItemText: {
        color: 'white',
        fontSize: 16
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
        
