import React, { useState } from 'react';
import { View, Modal, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Change 'FontAwesome' to the desired icon set

const BudgetInputModal = ({ isVisible, onClose, onSubmit, onCancel }) => {
  const [newBudget, setNewBudget] = useState('');
  const [formattedBudget, setFormattedBudget] = useState('');

  const handleBudgetChange = (text) => {
    // Remove non-digit characters and format for display
    const formattedAmount = text.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    setFormattedBudget(formattedAmount);
    setNewBudget(text);
  };

  const clearInput = () => {
    setNewBudget('');
    setFormattedBudget('');
  };

  const handleSubmit = () => {
    // Remove non-digit characters before parsing
    const parsedBudget = parseFloat(newBudget.replace(/\D/g, ''));

    // Validate budget
    if (newBudget.trim() === '') {
      alert('Vui lòng nhập một giá trị chi tiêu hợp lệ.');
    } else if (parsedBudget < 500) {
      alert('Chi tiêu phải nhỏ hơn 500đ.');
    } else if (parsedBudget >= 1000000000) {
      alert('Chi tiêu không được vượt quá 1 tỷ đ.');
    } else {
      onSubmit(parsedBudget);
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon name="paw" size={40} color="#8FCB8F" style={styles.budgetIcon} />
          <Text style={styles.modalTitle}>Nhập chi tiêu mới</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Chi tiêu mới"
              keyboardType="numeric"
              style={styles.input}
              value={formattedBudget} // Display the formatted budget
              onChangeText={handleBudgetChange}
            />
            <Text style={styles.currencySymbol}>đ</Text>
            {newBudget !== '' && (
              <TouchableOpacity onPress={clearInput}>
                <Icon name="times-circle" size={20} color="#ccc" style={styles.clearIcon}  />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  budgetIcon: {
    marginBottom: 20,
  },
  inputContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  currencySymbol: {
    fontSize: 16,
    marginLeft: 5,
  },
  clearIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: 80,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  submitButton: {
    width: 80,
    backgroundColor: '#8FCB8F',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BudgetInputModal;
