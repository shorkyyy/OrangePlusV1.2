import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ErrorModal from './ErrorModal'; // Import the ErrorModal component
import * as Haptics from 'expo-haptics';

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense, handleUpdateExpense, icon } = route.params;

  // Create states to track the edited values
  const [title, setTitle] = useState(expense.title);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(formatAmount(expense.amount)); // Format the initial amount
  const [date, setEditDate] = useState(expense.date);
  const [errorMessage, setErrorMessage] = useState('');

  // Add the missing state for the error modal visibility
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // Function to format the amount with "." as a thousand separator and add "đ" for VND
  function formatAmount(amount) {
    return amount.toLocaleString('vi-VN');
  }

  // Function to enable the date input for editing
  const [isDateEditable, setIsDateEditable] = useState(false);
  const handleEditDate = () => {
    setIsDateEditable(true);
  };

  // Function to update the amount input as "50.000" when typing "50000"
  const formatAmountInput = (text) => {
    const formattedText = text.replace(/\D/g, ''); // Remove all non-numeric characters
    setAmount(formattedText.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')); // Add thousands separators
  };

  // Function to handle the save button press
  const handleSave = () => {
    // Format the edited amount (without the currency symbol or thousand separators)
    const amountWithoutFormat = amount.replace(/\D/g, '');
  
    // Split the date into year, month, and day
    const [year, month, day] = date.split('-').map(Number);
  
    let errorMessage = '';
  
    // Check for blank inputs
    if (!title.trim() || !description || !amountWithoutFormat || !date) {
      errorMessage = 'Vui lòng điền đầy đủ thông tin.';
    }
  
    // Check if the title is too long
    if (!errorMessage && title.length > 15) {
      errorMessage = 'Tên quá dài, hãy giảm độ dài xuống dưới 15 ký tự.';
    }
  
    // Check if the date is valid based on the year, month, and day values
    const isValidDate = (year >= 1000 && year <= 9999) && (month >= 1 && month <= 12) && (day >= 1 && day <= new Date(year, month, 0).getDate());
  
    if (!errorMessage && !isValidDate) {
      errorMessage = 'Ngày không hợp lệ.';
    }
  
    // Check if the amount is valid (greater than 0)
    if (!errorMessage && parseFloat(amountWithoutFormat) < 500) {
      errorMessage = 'Số tiền phải lớn hơn 500.';
    }
  
    if (errorMessage) {
      // Display the error modal with the appropriate error message
      setErrorMessage(errorMessage);
      setErrorModalVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }
  
    // Update the expense object with the edited data
    const editedExpense = {
      ...expense,
      title,
      description,
      amount: parseFloat(amountWithoutFormat.replace(/\./g, '')), // Remove thousands separators before saving
      date,
    };
  
    // Call the handleUpdateExpense function to update the expensesData
    handleUpdateExpense(editedExpense);
  
    // Navigate back to the MainScreen after saving
    navigation.navigate('MainScreen', { updatedExpense: editedExpense });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Icon for expense */}
        <FontAwesome5 name={icon} size={30} color="#fff" />
      </View>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Tiêu đề"
      />
      <Text style={styles.expenseDescription}>{expense.description}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
        <FontAwesome5 name="money-bill-wave" size={20} color="#8FCB8F" style={styles.detailsIcon} />
          <Text style={styles.detailsLabel}>Số Tiền:</Text>
          <View style={styles.currencyContainer}>
            <TextInput
              style={styles.detailsValue}
              value={amount}
              onChangeText={formatAmountInput} // Use the custom function to update amount changes
              placeholder="Số Tiền Đã Chi"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.currencySymbol}>đ</Text>
        </View>
        <View style={styles.detailsRow}>
        <FontAwesome5 name="calendar" size={20} color="#8FCB8F" style={styles.detailsIcon} />
          <Text style={[styles.detailsLabel, styles.detailsLabelText]}>Ngày:</Text>
          <TextInput
            style={[styles.detailsValue, styles.detailsValueText]}
            value={date}
            onChangeText={setEditDate}
            placeholder="Vào Ngày (YYYY-MM-DD)"
          />
        </View>
      </View>
      <ErrorModal isVisible={errorModalVisible} 
                  errorMessage={errorMessage} 
                  onCancel={() => setErrorModalVisible(false)} 
      />

      {/* Render the Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <FontAwesome5 name="save" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#8FCB8F',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8FCB8F',
    textAlign: 'center',
  },
  expenseDescription: {
    fontSize: 18,
    marginBottom: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  detailsIcon: {
    marginRight: 10,
  },
  detailsLabel: {
    fontSize: 18,
    color: '#555',
  },
  detailsLabelText: {
    lineHeight: 18, // Set the line height to match the font size
  },
  detailsValue: {
    fontSize: 18,
    textAlign: 'right',
    flex: 1,
    marginTop: 10, // Add marginTop to push the input field down slightly
  },
  detailsValueText: {
    lineHeight: 18, // Set the line height to match the font size
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // This will push the currency container to the right
  },
  currencySymbol: {
    fontSize: 18,
    color: '#333',
    marginLeft: 5,
    bottom: -5,
  },
  saveButton: {
    backgroundColor: '#8FCB8F',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row', // Add flexDirection to render icon and text in a row
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8, // Add marginLeft to create space between icon and text
  },
  buttonIcon: {
    marginRight: 8, // Add marginRight to create space between icon and text
  },
});

export default EditExpenseScreen;
